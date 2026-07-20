const markdownFile = "resume.md";

const resumeRoot = document.querySelector("#resume");

const defaultMeta = {
  title: "CodeCV简历 - 前端工程师",
  subtitle: "高级前端工程师",
  experience: "3年经验",
  age: "25岁",
  gender: "男",
  phone: "18522225387",
  email: "coderleilei@163.com",
  github: "https://github.com/acmenlei",
  blog: "yueque.com/xiongleixin",
  accent: "#790FAE",
  text: "#555",
  font: 'Nunito, Inter, "PingFang SC", "Microsoft YaHei", sans-serif',
  lineHeight: "22px",
};

async function loadResume() {
  try {
    const response = await fetch(`${markdownFile}?t=${Date.now()}`);
    if (!response.ok) {
      throw new Error(`读取失败：${response.status}`);
    }

    const markdown = await response.text();
    renderResume(markdown);
  } catch (error) {
    resumeRoot.innerHTML = `
      <p class="error">
        无法读取 <code>${markdownFile}</code>。请在当前目录运行
        <code>python3 -m http.server 8000</code>，然后访问
        <code>http://localhost:8000</code>。<br />${escapeHtml(error.message)}
      </p>
    `;
  }
}

function renderResume(markdown) {
  const { meta, body } = parseFrontMatter(markdown);
  const resumeMeta = { ...defaultMeta, ...meta };
  applyTheme(resumeMeta);
  resumeRoot.innerHTML = `${renderHeader(resumeMeta)}${renderMarkdown(body)}`;
}

function parseFrontMatter(markdown) {
  const match = markdown.match(/^---\s*\n([\s\S]*?)\n---\s*\n?/);
  if (!match) {
    return { meta: {}, body: markdown };
  }

  const meta = {};
  match[1].split("\n").forEach((line) => {
    const item = line.match(/^([\w-]+):\s*(.*)$/);
    if (!item) return;
    meta[item[1]] = stripQuotes(item[2].trim());
  });

  return { meta, body: markdown.slice(match[0].length) };
}

function stripQuotes(value) {
  return value.replace(/^['"]|['"]$/g, "");
}

function applyTheme(meta) {
  const root = document.documentElement;
  root.style.setProperty("--accent", meta.accent);
  root.style.setProperty("--text", meta.text);
  root.style.setProperty("--resume-font", meta.font);
  root.style.setProperty("--line-height", meta.lineHeight);
  document.title = meta.title;
}

function renderHeader(meta) {
  const headline = [meta.experience, meta.age, meta.gender, meta.phone].filter(Boolean).join(" / ");
  const contactItems = [
    { icon: "☎", label: headline },
    { icon: "✉", label: meta.email, href: `mailto:${meta.email}` },
    { icon: "◑", label: meta.github, href: meta.github },
    { icon: "◒", label: meta.blog, href: normalizeUrl(meta.blog) },
  ];

  const avatar = meta.avatar
    ? `<img src="${escapeAttribute(meta.avatar)}" alt="${escapeAttribute(meta.subtitle)}头像" />`
    : escapeHtml((meta.subtitle || meta.title).slice(0, 1));

  return `
    <header class="resume-header">
      <div>
        <h1 class="resume-title">${escapeHtml(meta.title)}</h1>
        <div class="contact-grid">
          ${contactItems.map(renderContactItem).join("")}
        </div>
      </div>
      <div class="avatar" aria-hidden="true">${avatar}</div>
    </header>
  `;
}

function renderContactItem(item) {
  if (!item.label) return "";
  const label = escapeHtml(item.label);
  const content = item.href
    ? `<a href="${escapeAttribute(item.href)}" target="_blank" rel="noreferrer">${label}</a>`
    : `<span>${label}</span>`;
  return `<div class="contact-item"><span class="contact-icon">${item.icon}</span>${content}</div>`;
}

function normalizeUrl(value) {
  if (!value) return "";
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}

function renderMarkdown(markdown) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const html = [];
  let paragraph = [];
  let listOpen = false;
  let sectionOpen = false;

  const closeParagraph = () => {
    if (!paragraph.length) return;
    html.push(`<p>${renderInline(paragraph.join(" "))}</p>`);
    paragraph = [];
  };

  const closeList = () => {
    if (!listOpen) return;
    html.push("</ul>");
    listOpen = false;
  };

  const closeBlocks = () => {
    closeParagraph();
    closeList();
  };

  lines.forEach((line) => {
    const trimmed = line.trim();

    if (!trimmed) {
      closeBlocks();
      return;
    }

    if (trimmed.startsWith("## ")) {
      closeBlocks();
      if (sectionOpen) html.push("</section>");
      sectionOpen = true;
      html.push(`<section class="resume-section"><h2>${renderInline(trimmed.slice(3))}</h2>`);
      return;
    }

    if (trimmed.startsWith("### ")) {
      closeBlocks();
      html.push(renderItemHeading(trimmed.slice(4)));
      return;
    }

    if (trimmed.startsWith("- ")) {
      closeParagraph();
      if (!listOpen) {
        html.push("<ul>");
        listOpen = true;
      }
      html.push(`<li>${renderInline(trimmed.slice(2))}</li>`);
      return;
    }

    paragraph.push(trimmed);
  });

  closeBlocks();
  if (sectionOpen) html.push("</section>");
  return html.join("\n");
}

function renderItemHeading(text) {
  const parts = text.split("|").map((part) => part.trim());
  if (parts.length < 2) {
    return `<h3>${renderInline(text)}</h3>`;
  }

  const date = parts.pop();
  return `
    <div class="item-heading">
      <h3>${renderInline(parts.join(" | "))}</h3>
      <time>${renderInline(date)}</time>
    </div>
  `;
}

function renderInline(text) {
  return escapeHtml(text)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\[([^\]]+)]\(([^)]+)\)/g, (_, label, href) => {
      return `<a href="${escapeAttribute(href)}" target="_blank" rel="noreferrer">${label}</a>`;
    });
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replaceAll("`", "&#096;");
}

loadResume();
