# bundle exec irb -I. -r app.rb

## Chapter retrieval restricted | GET /api/chapters
# curl -X GET http://localhost:4567/api/chapters

## Chapter with entries unrestricted retrieval | POST /api/chapters ##
# curl -H "Content-Type: application/json" -X POST -d '{"data": null, "secretKey": "hello"}' http://localhost:4567/api/chapters

## Chapter creation with entries | POST /api/chapters/crupdate ##
# curl -H "Content-Type: application/json" -X POST -d '{"data": {"id": null, "order": 1, "stylesheet": "<dingle mcringleberry>", "title": "Shallom!", "content": "Beep boop", "release_date": "2015-10-01 12:30:00", "authors_note": "wao", "entries_attributes": [{"id": null, "order": 1, "level": 1, "title": "Entry #1", "content": "Hinkle dinkle doo", "release_date": "2015-10-01 12:30:00", "authors_note": "Womp"}, {"id": null, "order": 2, "level": 2, "title": "Entry #2", "content": "Hinkle dinkle doo", "release_date": "2015-10-01 12:30:00", "authors_note": "Wimp"}]}, "secretKey": "hello"}' http://localhost:4567/api/chapters/crupdate

## Chapter update with entries | POST /api/chapters/crupdate ##
# curl -H "Content-Type: application/json" -X POST -d '{"data": {"id": 5, "order": 1, "stylesheet": "<dingle mcringleberry>", "title": "Hey!", "content": "Beep boop", "release_date": "2015-10-01 12:30:00 -0400", "authors_note": "wao", "entries_attributes": [{"id": 7, "order": 1, "level": 1, "title": "HELLO!!!", "content": "Hinkle dinkle doo", "release_date": "2015-10-01 12:30:00 -0400", "authors_note": "Womp"}, {"id": null, "order": 3, "level": 2, "title": "Entry #3", "content": "Hinkle dinkle doo", "release_date": "2015-10-01 12:30:00 -0400", "authors_note": "Wimp"}]}, "secretKey": "hello"}' http://localhost:4567/api/chapters/crupdate

## Chapter update with entries | Reordering | POST /api/chapters/crupdate ##
# curl -H "Content-Type: application/json" -X POST -d '{"data": {"id": 6, "order": 10, "entries_attributes": [{"id": 9, "order": 3}, {"id": 10, "order": 5}]}, "secretKey": "hello"}' http://localhost:4567/api/chapters/crupdate

## Chapter deletion | POST /api/chapters/delete ##
# curl -H "Content-Type: application/json" -X POST -d '{"data": [3, 5], "secretKey": "hello"}' http://localhost:4567/api/chapters/delete

@chapter1 = Chapter.create(order: 1, stylesheet: "<dingle mcringleberry>", title: "Hey!", content: "Beep boop", release_date: "2015-10-01 12:30:00 -0400", authors_note: "wao")
@chapter1.entries.create(order: 1, title: "Entry #1", level: 1, content: "Hinkle dinkle domp", release_date: "2015-10-02 12:30:00 -0400", authors_note: "Womp")
@chapter1.entries.create(order: 1, title: "Entry #2", level: 1, content: "Hinkle dinkle domp", release_date: "2015-10-02 12:30:00 -0400", authors_note: "Womp")
@chapter2 = Chapter.create(order: 2, stylesheet: "<dingle mcringleberry>", title: "Hey!", content: "Beep boop", release_date: "2016-10-01 12:30:00 -0400", authors_note: "wao")
@chapter2.entries.create(order: 1, title: "Entry #1", level: 1, content: "Hinkle dinkle domp", release_date: "2016-10-02 12:30:00 -0400", authors_note: "Womp")
@chapter2.entries.create(order: 2, title: "Entry #2", level: 2, content: "Hinkle dinkle womp", release_date: "2016-10-02 12:30:00 -0400", authors_note: "Wimp")
@chapter3 = Chapter.create(order: 3, stylesheet: "<dingle mcrinkleberry>", title: "Hej!", content: "Beep bomp", release_date: "2016-01-02 12:30:00 -0500", authors_note: "woo")
@chapter3.entries.create(order: 1, title: "Entry #1", level: 1, content: "Hinkle dinkle domp", release_date: "2016-01-02 12:30:00 -0500", authors_note: "Womp")
@chapter3.entries.create(order: 2, title: "Entry #2", level: 2, content: "Hinkle dinkle womp", release_date: "2016-01-02 12:30:00 -0500", authors_note: "Wimp")
@chapter4 = Chapter.create(order: 4, stylesheet: "<dingle mcrangleberry>", title: "Hai!", content: "Beep bomp", release_date: "2016-10-11 12:30:00 -0400", authors_note: "woo")
@chapter5 = Chapter.create(order: 5, stylesheet: "<dingle mcrangleberry>", title: "Hai!", content: "Beep bomp", release_date: "2015-10-11 12:30:00 -0400", authors_note: "woo")
@chapter5.entries.create(order: 1, title: "Entry #1", level: 2, content: "Hinkle dinkle womp", release_date: "2015-10-02 12:30:00 -0400", authors_note: "Wimp")
@chapter5.entries.create(order: 2, title: "Entry #2", level: 2, content: "Hinkle dinkle womp", release_date: "2015-10-02 12:30:00 -0400", authors_note: "Wimp")
@chapter6 = Chapter.create(order: 6, stylesheet: "<dingle mcrangleberry>", title: "EDT Time Zone!", content: "Beep bomp", release_date: "2015-10-11 12:30:00 UTC", authors_note: "woo")
@chapter7 = Chapter.create(order: 7, stylesheet: "<dingle mcrangleberry>", title: "EST Time Zone!", content: "Beep bomp", release_date: "2016-03-10 12:30:00 UTC", authors_note: "woo")
