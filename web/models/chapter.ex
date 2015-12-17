defmodule Mmp.Chapter do
  use Mmp.Web, :model

  @derive {Poison.Encoder, only: [:order, :stylesheet, :title, :content, :release_date, :authors_note, :entries]}

  schema "chapters" do
    field :order, :integer
    field :stylesheet
    field :title
    field :content
    field :release_date, Ecto.DateTime
    field :authors_note

    timestamps

    has_many :entries, Mmp.Entry
  end

  @required_fields ~w(order stylesheet title content release_date authors_note)
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
