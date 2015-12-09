# Script for populating the database. You can run it as:
#
#     mix run priv/repo/seeds.exs
#
# Inside the script, you can read and write to any of your
# repositories directly:
#
#     Mmp.Repo.insert!(%SomeModel{})
#
# We recommend using the bang functions (`insert!`, `update!`
# and so on) as they will fail if something goes wrong.

Mmp.Repo.insert!(%Mmp.Chapter{
  order: 1,
  stylesheet: "<dingle mcringleberry>",
  title: "Test Chapter",
  content: "Hello there Ding. Lorum ipsum dude.",
  release_date: Tuple.to_list(Ecto.DateTime.cast("2016-12-20 12:10:10"))[1]
})
Mmp.Repo.insert!(%Mmp.Entry{
  chapter: 1,
  level: 0,
  order: 1,
  title: "Test Subchapter",
  content: "Lorum Lorum Ipsum Ipsum",
  release_date: Tuple.to_list(Ecto.DateTime.cast("2016-12-20 12:10:10"))[1]
})
Mmp.Repo.insert!(%Mmp.Entry{
  chapter: 1,
  level: 1,
  order: 2,
  title: "Test Entry",
  content: "Lorum Lorum Lorum Ipsum Ipsum Ipsum",
  release_date: Tuple.to_list(Ecto.DateTime.cast("2016-12-20 12:10:10"))[1]
})
Mmp.Repo.insert!(%Mmp.Entry{
  chapter: 1,
  level: 1,
  order: 3,
  title: "Test Entry #2",
  content: "Lorum Lorum Lorum Lorum Ipsum Ipsum Ipsum Ipsum",
  release_date: Tuple.to_list(Ecto.DateTime.cast("2016-12-20 12:10:10"))[1]
})
