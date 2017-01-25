# MMP Beta Test

## Overview

Welcome to testing, the game of breaking things! Your goal is to find bugs in the Reader application before it gets to actual readers. That means doing everything in your power to break things. And I mean everything. Zoom in and out of the page. Resize the window. Open it on mobile and chuck your phone across the room. Test it in every mode of every browser you can find. Turn pages as fast as you can. Jump between chapters. Everything.

Even if you think a user would never do something, do it anyway. I didn’t think a user would zoom out to 65% and turn the page forward on the last page of a chapter, but that caused a big error. And it wasn’t even directly related to being zoomed out. It occurred because some logic in the application actually didn’t handle having two headings on the last page---something that could entirely happen with normal use!

## Reporting a Bug

To report a bug, please [submit an issue](https://github.com/robwhitaker/MMPWebsiteV2/issues/new) on GitHub. 

**Note:** _Before posting a bug, please check to make sure no one else already reported it. If someone else reported it, but you feel you have more information to add, please leave that information as a comment on the original issue._

For the title, choose something concise yet descriptive---something that will tell me what the bug is without going into detail on it.

In the description, please include:
- **The device and browser the bug was encountered in.** Try to reproduce it on multiple devices and browsers. It will help me to know if it’s a general bug in the app or specific to a certain environment.
- **A descriptive summary of the bug, possibly including screenshots.** I want to know exactly what the bug looked like, so I can recognize it when I’m trying to reproduce the issue and produce a fix.
- **The exact steps you took to produce the bug.** Is it reproducible? If it occurred once, then it should certainly be able to occur again. Figure out how you produced the bug in the first place, how to reproduce it (as consistently as possible), and let me know the steps here. A bug report like “When chapter 2 rendered, there was only one page” is not particularly helpful. A bug report like “When you resize the screen three times in a row, then jump to segment 4 of chapter 2, the Reader shows that chapter 2 only has one page” is very helpful.
- **The reason you think the bug may have occurred.** This falls more into debugger territory, so don’t feel obligated to figure this out and include it. However, if you can manage it, this information would be very helpful to me.

## Tester Checklist

This checklist represents the bare minimum functionality that each tester should cover; the expected behavior of each item on this list is described in detail under [Expected Reader Functionality](#expected-reader-functionality). A good test will consist of mixing and matching various permutations of items on the below list. Try to come up with your own creative test cases!

- [ ] Book Events    
    - [ ] Open 
        - [ ] Cover Click
        - [ ] URL Load
    - [ ] Inline Links
        - [ ] Share
        - [ ] Comment
        - [ ] Author's Note
    - [ ] Render
    - [ ] Reflow
- [ ] Book Navigation Events
    - [ ] Table Of Contents
        - [ ] Within Chapter
        - [ ] Between Chapters
    - [ ] Page Turn (forward/backward)
        - [ ] Within Chapter
        - [ ] Between Chapters 
    - [ ] URL Load
    - [ ] Bookmark
    - [ ] Inline Link
        - [ ] Comment
        - [ ] Author's Note
- [ ] On Selected Entry Change
    - [ ] Disqus update
    - [ ] Title update
    - [ ] Bookmark update
    - [ ] ToC heading update
    - [ ] Hash update
    - [ ] Renderer checkpoint update
- [ ] Bookmarks
    - [ ] Set on Selected Entry Change
    - [ ] Set on arrival at Entry
- [ ] Cover Open/Closed State
    - [ ] Open
    - [ ] Closed
- [ ] Misc.
    - [ ] Contact Link
    - [ ] Credits Link
    - [ ] Social Buttons
    - [ ] Mailchimp Sign-Up Form
