defmodule Mmp.PageController do
  use Mmp.Web, :controller

  def editor(conn, _params) do
    render conn, "editor.html"
  end

  def index(conn, _params) do
  	render conn, "reader.html"
  end

end
