using Markdig;
using PersonalInformation.Models;

namespace PersonalInformation.Services;

public class BlogService
{
    private readonly string _postsPath;
    private readonly MarkdownPipeline _pipeline;

    public BlogService(IWebHostEnvironment env)
    {
        // Fix: Use wwwroot/posts folder
        _postsPath = Path.Combine(env.WebRootPath, "posts");
        _pipeline = new MarkdownPipelineBuilder().UseAdvancedExtensions().Build();
    }

    public List<BlogPost> GetAllPosts()
    {
        if (!Directory.Exists(_postsPath))
        {
            Console.WriteLine($"Posts directory not found: {_postsPath}");
            return new List<BlogPost>();
        }

        var posts = new List<BlogPost>();
        var files = Directory.GetFiles(_postsPath, "*.md");

        Console.WriteLine($"Found {files.Length} markdown files in {_postsPath}");

        foreach (var file in files)
        {
            try
            {
                var post = ParsePost(file);
                if (post != null)
                {
                    posts.Add(post);
                    Console.WriteLine($"Loaded post: {post.Title}");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error parsing {file}: {ex.Message}");
            }
        }

        return posts.OrderByDescending(p => p.Date).ToList();
    }

    public BlogPost? GetPostBySlug(string slug)
    {
        var file = Path.Combine(_postsPath, $"{slug}.md");
        return File.Exists(file) ? ParsePost(file) : null;
    }

    private BlogPost? ParsePost(string filePath)
    {
        var raw = File.ReadAllText(filePath);
        var slug = Path.GetFileNameWithoutExtension(filePath);

        if (!raw.StartsWith("---")) return null;

        var parts = raw.Split("---", 3);
        if (parts.Length < 3) return null;

        var frontmatter = parts[1];
        var body = parts[2].Trim();

        var meta = new Dictionary<string, string>();
        foreach (var line in frontmatter.Split('\n', StringSplitOptions.RemoveEmptyEntries))
        {
            var idx = line.IndexOf(':');
            if (idx < 0) continue;
            meta[line[..idx].Trim()] = line[(idx + 1)..].Trim();
        }

        return new BlogPost
        {
            Slug = slug,
            Title = meta.GetValueOrDefault("title", slug),
            Excerpt = meta.GetValueOrDefault("excerpt", ""),
            Tag = meta.GetValueOrDefault("tag", "General"),
            Date = DateTime.TryParse(meta.GetValueOrDefault("date"), out var d) ? d : DateTime.MinValue,
            ReadTime = meta.GetValueOrDefault("readTime", ""),
            ContentHtml = Markdown.ToHtml(body, _pipeline)
        };
    }
}