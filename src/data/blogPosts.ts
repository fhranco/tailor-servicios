import blogArticlesJson from './blog_articles.json';

export interface BlogArticleSubsection {
  title: string;
  paragraphs: string[];
}

export interface BlogArticleSection {
  heading: string;
  paragraphs: string[];
  subsections?: BlogArticleSubsection[];
  quote?: string;
  list?: string[];
  callout?: {
    title: string;
    text: string;
  };
}

export interface BlogArticle {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  categoryKey: string;
  date: string;
  dateEn?: string;
  isoDate: string;
  readTime: string;
  wordCount: number;
  author: {
    id?: string;
    name: string;
    role: string;
    institution: string;
    avatar?: string;
  };
  image: string;
  imageAlt: string;
  summary: string;
  keywords: string[];
  keyTakeaways: string[];
  sections: BlogArticleSection[];
  conclusion: {
    title: string;
    text: string;
  };
  contentHtml?: string;
  titleEn?: string;
  subtitleEn?: string;
  categoryEn?: string;
  summaryEn?: string;
  readTimeEn?: string;
  keywordsEn?: string[];
  keyTakeawaysEn?: string[];
  sectionsEn?: BlogArticleSection[];
  conclusionEn?: {
    title: string;
    text: string;
  };
  contentHtmlEn?: string;
  rawDraftEn?: string;
  featured?: boolean;
  published_at?: string;
}

export const blogArticlesEs: BlogArticle[] = blogArticlesJson as BlogArticle[];

function getLiveArticles(): BlogArticle[] {
  return blogArticlesEs;
}

export function getBlogArticleBySlug(slug: string, locale: string = 'es'): BlogArticle | undefined {
  const articles = getLiveArticles();
  const article = articles.find(a => a.slug === slug);
  if (!article) return undefined;

  if (locale === 'en') {
    return {
      ...article,
      title: article.titleEn || article.title,
      subtitle: article.subtitleEn || article.subtitle,
      category: article.categoryEn || article.category,
      date: article.dateEn || article.date,
      summary: article.summaryEn || article.summary,
      readTime: article.readTimeEn || article.readTime.replace('min de lectura', 'min read'),
      keywords: article.keywordsEn && article.keywordsEn.length > 0 ? article.keywordsEn : article.keywords,
      keyTakeaways: article.keyTakeawaysEn && article.keyTakeawaysEn.length > 0 ? article.keyTakeawaysEn : article.keyTakeaways,
      sections: article.sectionsEn && article.sectionsEn.length > 0 ? article.sectionsEn : article.sections,
      conclusion: article.conclusionEn || article.conclusion,
      contentHtml: article.contentHtmlEn || (article.sectionsEn && article.sectionsEn.length > 0 ? undefined : article.contentHtml)
    };
  }

  return article;
}

export function getAllBlogSlugs(): string[] {
  const articles = getLiveArticles();
  return articles.map(article => article.slug);
}
