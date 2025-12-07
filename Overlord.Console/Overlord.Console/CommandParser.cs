namespace Overlord.Console;

/// <summary>
/// Parses text commands entered by the player.
/// </summary>
public class CommandParser
{
    public Command Parse(string input)
    {
        if (string.IsNullOrWhiteSpace(input))
            return new Command { Action = "unknown", Args = Array.Empty<string>() };

        var parts = input.Split(' ', StringSplitOptions.RemoveEmptyEntries);
        var action = parts[0].ToLower();
        var args = parts.Length > 1 ? parts[1..] : Array.Empty<string>();

        return new Command
        {
            Action = action,
            Args = args
        };
    }
}

/// <summary>
/// Represents a parsed command.
/// </summary>
public class Command
{
    public string Action { get; set; } = string.Empty;
    public string[] Args { get; set; } = Array.Empty<string>();
}
