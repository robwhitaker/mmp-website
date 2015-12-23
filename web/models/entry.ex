defmodule Mmp.Entry do
  use Mmp.Web, :model

  @derive {Poison.Encoder, only: [:id, :chapter_id, :level, :order, :title, :content, :release_date, :authors_note]}

  schema "entries" do
    field :level, :integer
    field :order, :integer
    field :title
    field :content
    field :release_date, Ecto.DateTime
    field :authors_note

    timestamps

    belongs_to :chapter, Mmp.Chapter
  end

  @required_fields ~w(chapter_id level order title content release_date authors_note)
  @optional_fields ~w()

  @doc """
  Creates a changeset based on the `model` and `params`.

  If no params are provided, an invalid changeset is returned
  with no validation performed.
  """

  def changeset(model, params \\ :empty) do
    model
    |> cast(params, @required_fields, @optional_fields)
  end
end
