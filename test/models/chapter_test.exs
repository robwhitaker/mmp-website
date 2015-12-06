defmodule Mmp.ChapterTest do
  use Mmp.ModelCase

  alias Mmp.Chapter

  @valid_attrs %{content: "some content", order: 42, release_date: "2010-04-17 14:00:00", stylesheet: "some content", title: "some content"}
  @invalid_attrs %{}

  test "changeset with valid attributes" do
    changeset = Chapter.changeset(%Chapter{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = Chapter.changeset(%Chapter{}, @invalid_attrs)
    refute changeset.valid?
  end
end
