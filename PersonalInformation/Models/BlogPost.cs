namespace PersonalInformation.Models;

public class BlogPost
{
    public string Slug { get; set; } = "";
    public string Title { get; set; } = "";
    public string Excerpt { get; set; } = "";
    public string Tag { get; set; } = "";
    public DateTime Date { get; set; }
    public string ReadTime { get; set; } = "";
    public string ContentHtml { get; set; } = "";
}