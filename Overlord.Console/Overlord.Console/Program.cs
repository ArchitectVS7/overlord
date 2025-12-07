using Overlord.Core;
using Overlord.Core.Models;

namespace Overlord.Console;

/// <summary>
/// Console playtest application for Overlord v1.0.
/// Provides text-based interface to test all game mechanics.
/// </summary>
class Program
{
    static void Main(string[] args)
    {
        System.Console.Clear();
        System.Console.ForegroundColor = ConsoleColor.Cyan;
        System.Console.WriteLine(@"
   ___  _   ____________  __    ____  ____  ____
  / _ \| | / / __/ __/ / / /   / __ \/ __ \/ __ \
 / // / |/ / _// _// /_/ /   / /_/ / /_/ / / / /
/____/|___/___/___/\____/    \____/\____/_/ /_/

        Console Playtest Edition v1.0
");
        System.Console.ResetColor();
        System.Console.WriteLine("Platform-Agnostic Game Engine Test\n");

        var controller = new GameController();
        controller.Run();
    }
}
