import { MetadataRoute } from 'next'
import fs from 'fs'
import path from 'path'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://locapp.ai'

  // Klasörleri otomatik tarayan yardımcı fonksiyon
  const getFolders = (dirRelativePath: string) => {
    // Ekran görüntüsündeki 'src/app' yapısına göre yol tanımı
    const fullPath = path.join(process.cwd(), 'src/app', dirRelativePath)
    
    if (!fs.existsSync(fullPath)) return []
    
    return fs.readdirSync(fullPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory() && !dirent.name.startsWith('_'))
      .map(dirent => dirent.name)
  }

  // 1. Statik Rotalar (Görüntüde var olan ve belirttiğin sayfalar)
  const staticRoutes = [
    '',                         // Ana sayfa
    '/localization-risk',       // Ekran görüntüsündeki klasör
    '/cultural-tone-analysis',  // Belirttiğin statik sayfa
    '/privacy',                 // Belirttiğin statik sayfa
    '/articles',                // Makale ana dizini
    '/glossary',                // Sözlük ana dizini
    '/use-cases'                // Kullanım durumları ana dizini
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8,
  }))

  // 2. Dinamik Bölümler (Klasör isimlerini otomatik çeker)
  // 'articles' altındaki klasörleri tarar
  const articleRoutes = getFolders('articles').map((slug) => ({
    url: `${baseUrl}/articles/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  // 'glossary' altındaki klasörleri tarar
  const glossaryRoutes = getFolders('glossary').map((slug) => ({
    url: `${baseUrl}/glossary/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  // 'use-cases' altındaki klasörleri tarar
  const useCaseRoutes = getFolders('use-cases').map((slug) => ({
    url: `${baseUrl}/use-cases/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  return [...staticRoutes, ...articleRoutes, ...glossaryRoutes, ...useCaseRoutes]
}