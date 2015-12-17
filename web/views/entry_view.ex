defmodule Mmp.EntryView do
  use Mmp.Web, :view

  def render("index.json", %{entries: entries}) do
    %{data: render_many(entries, Mmp.EntryView, "entry.json")}
  end

  def render("show.json", %{entry: entry}) do
    %{data: render_one(entry, Mmp.EntryView, "entry.json")}
  end

  def render("entry.json", %{entry: entry}) do
    %{id: entry.id,
      chapter_id: entry.chapter_id,
      level: entry.level,
      order: entry.order,
      title: entry.title,
      content: entry.content,
      release_date: entry.release_date,
      authors_note: entry.authors_note}
  end
end
