# Automatic Blog Feed Setup

## Overview
Your blog now automatically fetches and displays articles from popular tech sites using RSS feeds. The system:
- ✅ Pulls articles from Dev.to, CSS-Tricks, Smashing Magazine, Web.dev, and more
- ✅ Updates automatically when the page loads
- ✅ Maintains your existing card design and layout
- ✅ Works with search and filter functionality
- ✅ Shows loading states and handles errors gracefully

## Current Feed Sources

### Active Feeds:
1. **Dev.to** - Tutorials and developer articles
2. **CSS-Tricks** - CSS and frontend techniques
3. **JavaScript Weekly** - JavaScript news and tutorials
4. **Smashing Magazine** - Web design and development
5. **Web.dev** - Google's web development best practices

## How It Works

### File: `js/blog-feed.js`
The main script that:
- Fetches RSS feeds from tech sites
- Converts them to JSON using rss2json.com API
- Transforms articles to match your blog card format
- Handles filtering and searching
- Displays loading states

### Integration: `pages/blog.html`
Added script tag: `<script src="../js/blog-feed.js"></script>`

## Customizing Feed Sources

### Adding a New Feed
Edit `js/blog-feed.js` and add to the `feeds` array:

```javascript
{
  name: 'Site Name',
  url: 'https://example.com/feed', // RSS feed URL
  category: 'tutorial', // Default category
  icon: 'fas fa-icon-name' // Font Awesome icon
}
```

### Available Categories:
- `tutorial` - How-to guides and tutorials
- `case-study` - Project case studies
- `insights` - Tech insights and analysis
- `javascript` - JavaScript-specific content
- `vue` - Vue.js content
- `css` - CSS and styling content

### Popular Tech RSS Feeds You Can Add:

```javascript
// Frontend Focus
{
  name: 'Frontend Focus',
  url: 'https://frontendfoc.us/rss',
  category: 'insights',
  icon: 'fas fa-code'
}

// A List Apart
{
  name: 'A List Apart',
  url: 'https://alistapart.com/main/feed/',
  category: 'insights',
  icon: 'fas fa-newspaper'
}

// Codrops
{
  name: 'Codrops',
  url: 'https://tympanus.net/codrops/feed/',
  category: 'tutorial',
  icon: 'fas fa-magic'
}

// freeCodeCamp
{
  name: 'freeCodeCamp',
  url: 'https://www.freecodecamp.org/news/rss/',
  category: 'tutorial',
  icon: 'fab fa-free-code-camp'
}

// Node Weekly
{
  name: 'Node Weekly',
  url: 'https://nodeweekly.com/rss',
  category: 'javascript',
  icon: 'fab fa-node-js'
}

// React Newsletter
{
  name: 'React Status',
  url: 'https://react.statuscode.com/rss',
  category: 'javascript',
  icon: 'fab fa-react'
}

// TypeScript News
{
  name: 'TypeScript Weekly',
  url: 'https://www.typescript-weekly.com/rss.xml',
  category: 'javascript',
  icon: 'fas fa-code'
}
```

## Features

### Automatic Loading
- Articles load when the page opens
- Shows a loading spinner while fetching
- Displays up to 20 most recent articles

### Smart Filtering
- Articles are categorized automatically based on tags
- Search works across titles, descriptions, and tags
- Category filter matches your existing filter options

### Error Handling
- Handles failed feed requests gracefully
- Continues loading other feeds if one fails
- Shows appropriate messages if no articles load

### Reading Time Calculation
- Automatically estimates reading time
- Based on ~200 words per minute
- Displays in minutes

### External Links
- All article links open in new tabs
- Includes `rel="noopener noreferrer"` for security
- Shows source name in article footer

## Refresh Articles

To manually refresh the feed (useful for testing):

```javascript
// In browser console or custom button
window.blogFeed.refresh();
```

## API Usage

### RSS2JSON API
- **Service**: https://api.rss2json.com
- **Plan**: Free tier (public API key)
- **Limits**: 10,000 requests/day
- **Rate**: More than enough for a personal portfolio

### Upgrading API (Optional)
If you need more requests or faster updates:
1. Sign up at https://rss2json.com
2. Get your API key
3. Replace `api_key=PUBLIC` with `api_key=YOUR_KEY` in blog-feed.js

## Troubleshooting

### Articles Not Loading?
1. Check browser console for errors
2. Verify RSS feed URLs are still active
3. Check if you've hit API limits (unlikely)
4. Some corporate networks block external APIs

### Wrong Categories?
Edit the `mapCategory()` function in blog-feed.js to adjust how tags map to your categories.

### Want Different Icon?
Change the `icon` property in each feed config. Use Font Awesome class names.

### Need More Articles?
Change `count=10` to higher number (max 100) in the API URL:
```javascript
`${this.rssToJsonAPI}?rss_url=${encodeURIComponent(feedConfig.url)}&api_key=PUBLIC&count=20`
```

## Styling

All articles use your existing CSS classes:
- `.article-card` - Main card container
- `.article-image` - Image/icon area
- `.article-content` - Text content
- `.article-meta` - Category and date
- `.article-title` - Article heading
- `.article-excerpt` - Description
- `.article-footer` - Stats and read more link

## Performance

- Articles are fetched in parallel (all feeds at once)
- Limited to 20 most recent articles for fast loading
- Images use lazy loading
- Cards animate in progressively

## Future Enhancements

Potential improvements you could add:
1. **Caching** - Store articles in localStorage to reduce API calls
2. **Pagination** - Show more articles with "Load More" button
3. **Featured Article** - Auto-update featured article at top
4. **Favorites** - Save favorite articles to localStorage
5. **Newsletter** - Add subscription form for updates
6. **Custom RSS** - Add your own blog posts via RSS

## Support

If you encounter issues:
1. Check browser console for errors
2. Verify feed URLs are accessible
3. Test with fewer feeds to isolate problems
4. Consider using your own RSS2JSON API key for better reliability

---

**Note**: RSS feeds are provided by third parties and may change or become unavailable. The system handles failures gracefully and continues with other feeds.
