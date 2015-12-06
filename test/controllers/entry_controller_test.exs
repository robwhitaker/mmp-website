defmodule Mmp.EntryControllerTest do
  use Mmp.ConnCase

  alias Mmp.Entry
  @valid_attrs %{chapter: 42, content: "some content", level: 42, order: 42, release_date: "2010-04-17 14:00:00", title: "some content"}
  @invalid_attrs %{}

  setup do
    conn = conn()
    {:ok, conn: conn}
  end

  test "lists all entries on index", %{conn: conn} do
    conn = get conn, entry_path(conn, :index)
    assert html_response(conn, 200) =~ "Listing entries"
  end

  test "renders form for new resources", %{conn: conn} do
    conn = get conn, entry_path(conn, :new)
    assert html_response(conn, 200) =~ "New entry"
  end

  test "creates resource and redirects when data is valid", %{conn: conn} do
    conn = post conn, entry_path(conn, :create), entry: @valid_attrs
    assert redirected_to(conn) == entry_path(conn, :index)
    assert Repo.get_by(Entry, @valid_attrs)
  end

  test "does not create resource and renders errors when data is invalid", %{conn: conn} do
    conn = post conn, entry_path(conn, :create), entry: @invalid_attrs
    assert html_response(conn, 200) =~ "New entry"
  end

  test "shows chosen resource", %{conn: conn} do
    entry = Repo.insert! %Entry{}
    conn = get conn, entry_path(conn, :show, entry)
    assert html_response(conn, 200) =~ "Show entry"
  end

  test "renders page not found when id is nonexistent", %{conn: conn} do
    assert_raise Ecto.NoResultsError, fn ->
      get conn, entry_path(conn, :show, -1)
    end
  end

  test "renders form for editing chosen resource", %{conn: conn} do
    entry = Repo.insert! %Entry{}
    conn = get conn, entry_path(conn, :edit, entry)
    assert html_response(conn, 200) =~ "Edit entry"
  end

  test "updates chosen resource and redirects when data is valid", %{conn: conn} do
    entry = Repo.insert! %Entry{}
    conn = put conn, entry_path(conn, :update, entry), entry: @valid_attrs
    assert redirected_to(conn) == entry_path(conn, :show, entry)
    assert Repo.get_by(Entry, @valid_attrs)
  end

  test "does not update chosen resource and renders errors when data is invalid", %{conn: conn} do
    entry = Repo.insert! %Entry{}
    conn = put conn, entry_path(conn, :update, entry), entry: @invalid_attrs
    assert html_response(conn, 200) =~ "Edit entry"
  end

  test "deletes chosen resource", %{conn: conn} do
    entry = Repo.insert! %Entry{}
    conn = delete conn, entry_path(conn, :delete, entry)
    assert redirected_to(conn) == entry_path(conn, :index)
    refute Repo.get(Entry, entry.id)
  end
end
