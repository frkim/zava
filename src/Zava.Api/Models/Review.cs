namespace Zava.Api.Models;

public class Review
{
    public int Id { get; set; }
    public int ProductId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public int Rating { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Comment { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public bool Verified { get; set; }
    public int HelpfulCount { get; set; }
}
