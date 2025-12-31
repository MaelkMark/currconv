# Contributing to CurrConv

All types of contributions are encouraged and valued. See the Table of Contents for different ways to help and details about how this project handles them. Please make sure to read the relevant section before making your contribution. The community looks forward to your contributions. 🎉

## Table of Contents

- [Contributing to CurrConv](#contributing-to-currconv)
  - [Table of Contents](#table-of-contents)
  - [Reporting Bugs](#reporting-bugs)
    - [Before Submitting a Bug Report](#before-submitting-a-bug-report)
    - [How Do I Submit a Good Bug Report?](#how-do-i-submit-a-good-bug-report)
  - [Suggesting Enhancements](#suggesting-enhancements)
    - [Before Submitting an Enhancement](#before-submitting-an-enhancement)
    - [How Do I Submit a Good Enhancement Suggestion?](#how-do-i-submit-a-good-enhancement-suggestion)
  - [Code Contribution](#code-contribution)

## Reporting Bugs

### Before Submitting a Bug Report

A good bug report shouldn't leave others needing to chase you up for more information. Therefore, we ask you to investigate carefully, collect information and describe the issue in detail in your report. Please complete the following steps in advance to help us fix any potential bug as fast as possible.

- Make sure that you are using the latest version.
- Determine if your bug is really a bug and not an error on your side.
- Check the [currently working on](README.md#currently-working-on) section to see if we are already working on this bug.
- To see if other users have experienced (and potentially already solved) the same issue you are having, check if there is not already a bug report existing for your bug or error in the [bug tracker](https://github.com/MaelkMark/currconv/issues?q=label%3Abug).
- Collect information about the bug:

  - Stack trace (Traceback)
  - OS, Chrome version
  - Can you reliably reproduce the issue?

### How Do I Submit a Good Bug Report?

Bugs are tracked as [GitHub issues](https://github.com/MaelkMark/currconv/issues). If you run into an issue with the project:

- Open an [Issue](https://github.com/MaelkMark/currconv/issues/new). (Since we can't be sure at this point whether it is a bug or not, we ask you not to talk about a bug yet and not to label the issue.)
- Explain the behavior you would expect and the actual behavior.
- Please provide as much context as possible and describe the *reproduction steps* that someone else can follow to recreate the issue on their own.
- Provide the information you collected in the previous section.

## Suggesting Enhancements

This section guides you through submitting an enhancement suggestion for CurrConv, **including completely new features and minor improvements to existing functionality**.

### Before Submitting an Enhancement

- Make sure that you are using the latest version.
- Find out if the functionality is already covered, maybe by an individual [configuration](#configuration).
- Check the [currently working on](README.md#currently-working-on) section to see if we are already working on this functionality.
- Perform a [search](https://github.com/MaelkMark/currconv/issues) to see if the enhancement has already been suggested. If it has, add a comment to the existing issue instead of opening a new one.

### How Do I Submit a Good Enhancement Suggestion?

Enhancement suggestions are tracked as [GitHub issues](https://github.com/MaelkMark/currconv/issues).

- Use a **clear and descriptive title** for the issue to identify the suggestion.
- Provide a **step-by-step description of the suggested enhancement** in as many details as possible.

- **Describe the current behavior** and **explain which behavior you expected to see instead** and why. At this point you can also tell which alternatives do not work for you.

- **Explain why this enhancement would be useful** to most users. You may also want to point out the other projects that solved it better and which could serve as inspiration.

## Code Contribution

If you want to contribute code to CurrConv, please follow these steps to ensure a smooth integration:

1. Fork the Repository: Create your own copy of the project on GitHub.
2. Clone the Project: Download your fork to your local machine.
3. Local Setup (Chrome Extension):

   - Open Chrome and navigate to `chrome://extensions/`.
   - Enable Developer mode in the top right corner.
   - Click Load unpacked and select the folder where you cloned the repository.
4. Create a Branch: Create a new branch for your work (e.g., `git checkout -b cool-new-thing`).
5. Make Changes: Implement your feature or bug fix.
6. Test Your Changes:
    - Go back to `chrome://extensions/`.
    - Click the Reload icon on the CurrConv card to apply your latest code changes.
    - Ensure your changes work as expected and don't break existing features.

7. Commit & Push: Commit your changes with a clear message and push them to your fork.
8. Submit a Pull Request (PR): Open a PR against our main branch. Describe your changes and link any related issues.