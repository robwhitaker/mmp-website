# MMP Beta Test

## Overview

Welcome to testing, the game of breaking things! Your goal is to find bugs in the Reader application before it gets to actual readers. That means doing everything in your power to break things. And I mean everything. Zoom in and out of the page. Resize the window. Open it on mobile and chuck your phone across the room. Test it in every mode of every browser you can find. Turn pages as fast as you can. Jump between chapters. Everything.

Even if you think a user would never do something, do it anyway. I didn’t think a user would zoom out to 65% and turn the page forward on the last page of a chapter, but that caused a big error. And it wasn’t even directly related to being zoomed out. It occurred because some logic in the application actually didn’t handle having two headings on the last page---something that could entirely happen with normal use!

## Reporting a Bug

To report a bug, please [submit an issue](https://github.com/robwhitaker/MMPWebsiteV2/issues/new). 

**Note:** _Before posting a bug, please check to make sure no one else already reported it. If someone else reported it, but you feel you have more information to add, please leave that information as a comment on the original issue._

For the title, choose something concise yet descriptive---something that will tell me what the bug is without going into detail on it.

In the description, please include:
- **The device, operating system, and browser the bug was encountered in.** Try to reproduce it on multiple devices and browsers. It will help me to know if it’s a general bug in the app or specific to a certain environment.
- **A descriptive summary of the bug, possibly including screenshots.** I want to know exactly what the bug looked like, so I can recognize it when I’m trying to reproduce the issue and produce a fix.
- **The exact steps you took to produce the bug.** Is it reproducible? If it occurred once, then it should certainly be able to occur again. Figure out how you produced the bug in the first place, how to reproduce it (as consistently as possible), and let me know the steps here. A bug report like “When chapter 2 rendered, there was only one page” is not particularly helpful. A bug report like “When you resize the screen three times in a row, then jump to segment 4 of chapter 2, the Reader shows that chapter 2 only has one page” is very helpful.
- **The reason you think the bug may have occurred.** This falls more into debugger territory, so don’t feel obligated to figure this out and include it. However, if you can manage it, this information would be very helpful to me.

## Tester Checklist

This checklist represents the bare minimum functionality that each tester should cover; the expected behavior of each item on this list is described in detail under [Expected Reader Functionality](#expected-reader-functionality). A good test will consist of mixing and matching various permutations of items on the below list. Try to come up with your own creative test cases!

- [ ] Book Events    
    - [x] Open 
        - [x] Cover Click
        - [x] Right arrow key
        - [x] URL Load
    - [ ] Inline Links
        - [x] Share
        - [x] Comment
        - [x] Author's Note
    - [x] Render
    - [x] Reflow
- [ ] Book Navigation Events
    - [x] Table Of Contents
        - [ ] Within Chapter
        - [ ] Between Chapters
    - [x] Page Turn (forward/backward)
        - [ ] Within Chapter
        - [ ] Between Chapters  
    - [x] URL Load
    - [ ] Bookmark
    - [x] Inline Link
        - [ ] Comment
        - [ ] Author's Note
    - [ ] Reflow checkpoint updates
- [ ] On Selected Entry Change
    - [x] Disqus update
    - [x] Author's Note update
    - [x] Title update
    - [x] Bookmark update
    - [x] Dropdown label update
    - [x] Hash update
    - [x] Reflow checkpoint update
- [ ] Bookmarks
    - [ ] Set on Selected Entry Change
    - [ ] Set on arrival at Entry
- [x] Cover Open/Closed State
    - [ ] Open
    - [ ] Closed
- [x] Table of Contents
    - [ ] Heading matches selected entry
    - [ ] Expands / Contracts
    - [ ] Unread bolded
    - [ ] Selected entry highlighted
    - [ ] "new!" next to most recent unread entries
- [ ] Footer
    - [ ] Contact Link
    - [ ] Credits Link
    - [x] Social Buttons
    - [ ] Mailchimp Sign-Up Form
- [ ] Misc.
    - [ ] High-res images load
    - [x] Forward arrow disabled on last page

## Expected Reader Functionality

This is a broad overview of how the Reader application should be expected to function. If you notice behavior deviating from this, it is likely a bug and should be reported. If you encounter something questionable that isn’t covered here, feel free to treat it like a bug as well.

If a term is unclear, check out the [terminology reference](#terminology-reference) at the end of this doc.

### Home Page
 
This page should display the logo and the book cover, taking up the whole screen. If you scroll down, you should see the footer. The comments/author’s note section should be hidden. The title of the page in the browser should be “Midnight Murder Party.” All of this should hold true whenever the book cover is closed.

Clicking on the book cover or pressing the right arrow key should open the book.

### Open Book

When the book is open, the comments/author’s note section should be visible below the book section and have a height of at least 100% of your screen height (like the Reader section). The [selected entry](#selected-entry) should be displayed at the top of the book with a little “expand” arrow next to it. An [empty entry](#empty-entry--no-content-entry) (an [entry](#entry) without content) should never be selected. In other words, “Episode 2.” should never be the heading. It should always be more like “Episode 2-2a-1. …” because segment “1” has actual text content. This same segment title should be displayed as the title of the web page in the form “Episode 2-2a-1… | Midnight Murder Party”. 

The author’s note and comment section should always reflect the [selected entry](#selected-entry). Each time the selected entry changes, you should see refresh (little spinner icon). If this doesn’t happen, something went wrong.

### Selecting an Entry

Determining which [entry](#entry) is considered “selected” happens in a few ways.

1. When you turn the page forward, the [selected entry](#selected-entry) should be the last heading on the previous pages. If you land on a page with a new heading, you remain on the last entry until you turn the page forward. This way, it never assumes you’ve reached the new heading when there’s still content from the old one on the page. The exception to this rule is when a new heading appears at the very top of the page. The Reader should then switch immediately to this heading.
2. When you turn the page backward, the [selected entry](#selected-entry) should change only once you’ve backed past the heading that was previously selected. It should switch the selection into the heading you have backed into. For example, if you are reading Segment 5 and back past the page with that heading, assuming the previous heading is Segment 4, that will be the new selection. However, if there are multiple headings on the page (i.e. Segment 4.5 and Segment 5 are on the same page), note that backing past the page with 4.5 and 5 should still bring you to Segment 4, skipping 4.5 entirely since you backed past it as well.
3. When you use the dropdown to jump to an entry, the entry you jumped to should invariably be considered “selected,” no matter where it is on the page. The only exception is if that heading has no content, at which point the Reader should pick the closest subheading with content.
4. When you load the site from a [share URL](#share) (i.e. midnightmurderparty.com/#!/e10), it should be treated the same as using the dropdown to jump to an entry. It should also open the front cover automatically.
5. Clicking on the inline links for Comments or Author’s Note should change the [selected entry](#selected-entry) to the entry those links are contained in, if that entry isn’t already selected.
6. Navigating forward or backward into another chapter should send you into either the next or previous selection with content, respectively. In other words, it should skip all headings that don’t have any content when picking selections.

### On Selected Entry Change

A lot of the Reader works based on which entry is selected. When one of the above actions changes the selected entry, all of the following should happen.

#### Disqus Update
The Disqus thread below the book should update to reflect the new selection. Note that while the "Discussion for..." text above the Disqus thread should reflect the selected segment, it does not indicate that Disqus has loaded the correct thread. Comment on entries, and navigate away from and back to them to make sure Disqus is updating properly.

#### Author's Note Update
The Author's Note below the book, if there is one for that entry, should update.

#### Title Update
The title of the page in the browser should update with the selection. An example title might be “Episode 2-2a-1… | Midnight Murder Party”. The title should always match the selected entry.

#### Dropdown Label Update
The displayed label on the dropdown at the top of the book should update to reflect to new selection. See [The Dropdown](#the-dropdown) for more details. 

#### Bookmark Update
When the selected entry changes, it should update the [bookmark](#bookmark) to match. More details on bookmark behavior below.

#### Hash Update
The hash is part of the URL which follows the hashtag (in `midnightmurderparty.com/#!/e10`, the hash is `#!/e10`). The hash should always contain the ID of the selected entry, which will always be in the format `#!/e{ID}` (for sub-chapters and segments) or `#!/c{ID}` (for chapters). If the selection changes and the hash doesn't, there is a good chance something went wrong. If you load the site from one of these hash URLs, it should immediately bring you back to the selected entry, regardless of where your bookmark is.

The selected entry will always be an entry with content. However, in specific cases where the parent headings of the selected entry have no content, the hash URL will be that of the top-most parent entry without content. This is because it seems most reasonable to share links to the first heading of a segment than the first with content. For example:

```
Episode 2. ...
    2a. Sleepytime Tea
        1
            ...content...
```

If a reader shares a link to segment 1, it makes more sense for the recipient to actually see the chapter and sub-chapter titles first. This only really matters when the screen is too small to fit all the headings at once. Note that, while the link should point to the top-most heading, the selected entry should still be the first one with content.

#### Reflow Checkpoint Update

The [reflow checkpoint](#reflow-checkpoint) update is a bit tricky because it doesn't happen on every selected entry change. The reflow checkpoint will be discussed more below, but for now just know that it should only change to match the selected entry ID when the heading for the selected entry is on the page.

### Navigating Between Chapters Via Page Turns

Turning the page can occassionally trigger rendering the next chapter. There is some specific behavior involved in this type of navigation which is as follows.

1. Turning the page forward on the last page of a chapter should bring you to the first page of the next chapter. If you are on the last chapter, nothing should happen.
2. Turning the page backward on the first page of a chapter should bring you to the last page of the previous chapter. Note that this shouldn’t bring you to the last HEADING but the last PAGE. The selection should still be the last entry of that chapter, of course. If you are on the first chapter, it should simply close the book.

### Render & Reflow

#### Render

The Reader application renders one chapter at a time since rendering the entire book in one go would be incredibly slow, especially as the book gets longer. When a chapter is rendering, the book text should disappear, and the reader should be presented with the word "Rendering..." along with a loading bar. 

Make sure you land where you would expect after the render process. For example, if the book is small enough to have only one heading per page, make sure that when a page turn forward navigates to the next chapter, the render process doesn't skip to the first heading with content (maybe on page 3 or 4)--it should put you at the beginning of the next chapter.

#### Reflow

When the book resizes, all the text inside of it reflows, and the Reader application has to recalculate where everything is. While it's reflowing, the book text should disappear, and the reader should be presented with the word "Reflowing..." along with a loading bar. When the reflow completes, it should bring the reader to the [reflow checkpoint](#reflow-checkpoint), and that checkpoint element should glow gold for a couple seconds to indicate approximately where the reader left off. Reflowing repeatedly should never change the checkpoint, and no matter how many times the reader reflows in a row, they should always end up in the same spot.

### The Dropdown

The dropdown menu should sit at the top of the book and should display the short title of the [selected entry](#selected-entry) and a black arrow next to that. When expanded, the arrow should disappear. Clicking on the closed dropdown should expand it. Selecting an item in the expanded dropdown or clicking outside of the dropdown, should close it.

Unread entries should appear as bold. The latest unread release(s) should have the text "new!" next to them. The [selected entry](#selected-entry) should be highlighted. 

If an entry title doesn’t fit within the width of the dropdown, it should not line wrap. It should instead be cut off with ellipses. 

Clicking on an entry should navigate the book to that entry, if it has content, or the next subheading with content, if it doesn’t.

### Book Bottom Bar

The book bottom bar should have a “previous” button (<) on the left, the page number in the middle, and a “next” (>) button on the right. The page number is relative to the chapter.

Pressing the prev and next buttons should, hopefully obviously, progress the current page back or forward by one. The back and forward arrow keys should do the same.

If you are on the last page of the entire story, the next arrow should not be displayed.

### End of Segment Links

#### Author’s Note
This link should appear conditionally. If there is no author’s note, it won’t appear. Clicking on it should smooth scroll the user down to the top of the author’s note section of the page. 

If the entry this link belongs to isn't the [selected entry](#selected-entry), the selected entry should change.

#### Comments
This link should display a (mostly) up-to-date count of the comments for that segment. If the count is a little off, don’t worry, though. Disqus’s API falls behind sometimes. Clicking on this link should smooth scroll the user down to the comments section of the page. 

If the entry this link belongs to isn't the [selected entry](#selected-entry), the selected entry should change.

#### Share
Clicking this link should open a full screen modal with share options centered on the screen (both vertically and horizontally). Options should include a text box with a share URL in it that the user can copy. Below that should be a checkbox (checked by default) that enables the user to choose whether to share from the current entry or to just to share the page. Changing this will change the above URL. Below this should be social media share links. These are unaffected by the above checkbox.

### Social Media Share Buttons

The social media share buttons (found in the footer of the page as well as in the Share modal), should open popups when clicked that allow you to share Midnight Murder Party from social media. Some browsers, like Internet Explorer, block these popups by default. This is worth noting, but not considered a bug. If the links otherwise don’t work for some reason, please report it.

### Page Footer

This part of the page isn’t entirely finished. Aside from the social media buttons, you don’t have to worry about this.

## Terminology Reference

#### Chapter 
The same thing as an Episode (or Interlude). In the code, it's just referred to as a chapter. The Reader application renders one chapter at a time. (i.e. _Episode 1. Welcome to the Party / Heat Wave_)

#### Sub-chapter

The heading level below a chapter. Chapters are broken into sub-chapters. (i.e. _1a. Welcome to the Party_)

#### Segment

The heading level below a sub-chapter, usually just a number denoting a new section or scene break. Content is usually released by segments.

#### Entry

An entry refers to a block of data from the database. It consists of a title, text content (optional), author's note (optional), release date, etc. Every heading in the Reader, whether it is a chapter, sub-chapter, or segment, is also an entry.

#### Empty entry / No-content entry

An entry with only a heading and no content.

#### Selected Entry

The selected entry refers to the entry that the Reader application considers active or currently being read. This changes with various navigation actions, and many things throughout the application are based on the selected entry (i.e. which Disqus thread is displayed, the ID in the URL hash, the table of contents selection, the current bookmark, etc.).

#### ToC

Table of Contents. Refers to the dropdown displayed at the top of the book.

#### Bookmark

The bookmark refers to an entry in persistant storage which the Reader application automatically keeps so it can bring the reader back to where they left off last time they visited the site.

#### Reflow Checkpoint

When a reflow occurs, the renderer does its best to remember where the reader was in the book and to put the reader back there. It does this using a reflow checkpoint, which refers to a paragraph or heading on the current page which the renderer takes note of after most navigation events in order to mark the reader's place.
