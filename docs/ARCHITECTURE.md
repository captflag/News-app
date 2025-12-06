# NewsPulse - Architecture & Flow Diagram

This document explains how the NewsPulse app works step by step.

## Application Architecture

```mermaid
flowchart TB
    subgraph User["👤 User"]
        Browser["Web Browser"]
    end

    subgraph App["⚡ NewsPulse React App"]
        subgraph Providers["Context Providers"]
            CP["CountryProvider"]
            SP["SearchProvider"]
            BP["BookmarkProvider"]
        end

        subgraph Components["UI Components"]
            NavBar["NavBar"]
            News["News Feed"]
            NewsCard["NewsCard"]
            FilterBar["FilterBar"]
            Bookmarks["Bookmarks Page"]
            Trending["Trending Page"]
        end

        subgraph Services["Services"]
            RSS["rssService.js"]
        end

        subgraph Storage["Local Storage"]
            LS["Bookmarks & Preferences"]
        end
    end

    subgraph External["🌐 External"]
        RSS2JSON["rss2json.com API"]
        RSSFeeds["RSS Feeds<br/>(BBC, NYT, TOI, etc.)"]
    end

    Browser --> Providers
    Providers --> Components
    Components --> RSS
    RSS --> RSS2JSON
    RSS2JSON --> RSSFeeds
    Components --> LS
```

## Data Flow - Loading News

```mermaid
sequenceDiagram
    participant U as User
    participant N as News Component
    participant RS as rssService
    participant API as rss2json.com
    participant RSS as RSS Feeds

    U->>N: Opens app / Selects category
    N->>N: Show loading skeleton
    N->>RS: fetchNews(country, category)
    RS->>API: GET /api.json?rss_url=...
    API->>RSS: Fetch RSS XML
    RSS-->>API: XML Feed
    API-->>RS: JSON Response
    RS->>RS: Parse & deduplicate articles
    RS-->>N: Array of articles
    N->>N: Apply filters & search
    N-->>U: Display NewsCards
```

## Component Hierarchy

```mermaid
graph TD
    App["App.js"]
    App --> CP["CountryProvider"]
    CP --> SP["SearchProvider"]
    SP --> BP["BookmarkProvider"]
    BP --> Router["BrowserRouter"]
    
    Router --> NavBar["NavBar<br/>🔍 Search | 🌍 Country | ⭐ Bookmarks"]
    Router --> Routes["Routes"]
    
    Routes --> News["News Component"]
    Routes --> Bookmarks["Bookmarks Page"]
    Routes --> Trending["Trending Page"]
    
    News --> FilterBar["FilterBar"]
    News --> NewsGrid["News Grid"]
    NewsGrid --> NC1["NewsCard 1"]
    NewsGrid --> NC2["NewsCard 2"]
    NewsGrid --> NC3["NewsCard ..."]
```

## State Management Flow

```mermaid
flowchart LR
    subgraph Contexts["React Contexts"]
        CC["CountryContext<br/>🌍 Selected Country"]
        SC["SearchContext<br/>🔍 Search Query"]
        BC["BookmarkContext<br/>⭐ Saved Articles"]
    end

    subgraph LocalStorage["💾 localStorage"]
        LC["country preference"]
        LB["bookmarks array"]
    end

    CC <--> LC
    BC <--> LB

    subgraph Components["Components"]
        Nav["NavBar"]
        NF["News Feed"]
        BM["Bookmarks"]
    end

    CC --> Nav
    CC --> NF
    SC --> Nav
    SC --> NF
    BC --> Nav
    BC --> NF
    BC --> BM
```

## Feature Workflow: Bookmarking an Article

```mermaid
sequenceDiagram
    participant U as User
    participant NC as NewsCard
    participant BC as BookmarkContext
    participant LS as localStorage

    U->>NC: Click bookmark icon ☆
    NC->>BC: toggleBookmark(article)
    BC->>BC: Check if already bookmarked
    alt Not bookmarked
        BC->>BC: Add to bookmarks array
        BC->>LS: Save updated bookmarks
        BC-->>NC: Update state
        NC-->>U: Show filled star ★
    else Already bookmarked
        BC->>BC: Remove from bookmarks
        BC->>LS: Save updated bookmarks
        BC-->>NC: Update state
        NC-->>U: Show empty star ☆
    end
```

## RSS Feed Sources

```mermaid
graph LR
    subgraph Countries["🌍 Country Selection"]
        IN["🇮🇳 India"]
        US["🇺🇸 USA"]
        UK["🇬🇧 UK"]
        AU["🇦🇺 Australia"]
    end

    subgraph IndiaFeeds["India Sources"]
        TOI["Times of India"]
        TH["The Hindu"]
        ET["Economic Times"]
    end

    subgraph USFeeds["US Sources"]
        NYT["NY Times"]
        NPR["NPR"]
        BLM["Bloomberg"]
    end

    subgraph UKFeeds["UK Sources"]
        BBC["BBC News"]
        GRD["The Guardian"]
    end

    subgraph AUFeeds["AU Sources"]
        ABC["ABC News"]
        SMH["Sydney Morning Herald"]
    end

    IN --> IndiaFeeds
    US --> USFeeds
    UK --> UKFeeds
    AU --> AUFeeds

    IndiaFeeds --> RSS2JSON["rss2json.com"]
    USFeeds --> RSS2JSON
    UKFeeds --> RSS2JSON
    AUFeeds --> RSS2JSON

    RSS2JSON --> App["NewsPulse App"]
```

## File Structure Overview

```mermaid
graph TD
    subgraph src["📁 src/"]
        App["App.js<br/>Main entry with routing"]
        
        subgraph components["📁 components/"]
            NavBar["NavBar.js"]
            News["News.js"]
            NewsCard["NewsCard.js"]
            FilterBar["FilterBar.js"]
            Spinner["Spinner.js"]
            Bookmarks["Bookmarks.js"]
            Trending["Trending.js"]
        end

        subgraph contexts["📁 contexts/"]
            SC["SearchContext.js"]
            BC["BookmarkContext.js"]
            CC["CountryContext.js"]
        end

        subgraph services["📁 services/"]
            RSS["rssService.js"]
        end

        subgraph hooks["📁 hooks/"]
            ULS["useLocalStorage.js"]
        end

        CSS["index.css<br/>Design System"]
    end

    App --> components
    App --> contexts
    components --> services
    contexts --> hooks
```

---

## Summary

| Step | What Happens |
|------|--------------|
| 1️⃣ | User opens app → React renders with context providers |
| 2️⃣ | News component mounts → Calls `fetchNews()` from rssService |
| 3️⃣ | rssService → Calls rss2json.com API with RSS feed URLs |
| 4️⃣ | API converts RSS XML → JSON and returns articles |
| 5️⃣ | Articles are parsed, deduplicated, and sorted by date |
| 6️⃣ | User can search → SearchContext filters articles |
| 7️⃣ | User can bookmark → BookmarkContext saves to localStorage |
| 8️⃣ | User switches country → CountryContext updates, new RSS feeds loaded |
