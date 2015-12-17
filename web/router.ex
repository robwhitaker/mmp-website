defmodule Mmp.Router do
  use Mmp.Web, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", Mmp do
    pipe_through :browser # Use the default browser stack

    get "/", PageController, :index
  end

  # Other scopes may use custom stacks.
  scope "/api", Mmp do
    pipe_through :api

    resources "/chapters", ChapterController, except: [:new, :edit]
    resources "/entries", EntryController, except: [:new, :edit]
  end
end
