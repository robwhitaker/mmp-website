defmodule Mmp.EntryTest do
  use Mmp.ModelCase

  alias Mmp.Entry

  @valid_attrs %{authors_note: "some content", chapter: 42, content: "some content", level: 42, order: 42, release_date: "2010-04-17 14:00:00", title: "some content"}
  @invalid_attrs %{}

  test "changeset with valid attributes" do
    changeset = Entry.changeset(%Entry{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = Entry.changeset(%Entry{}, @invalid_attrs)
    refute changeset.valid?
  end
end
