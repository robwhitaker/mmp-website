defmodule Mmp.Repo.Migrations.CreateChapter do
  use Ecto.Migration

  def change do
    create table(:chapters) do
      add :order, :integer
      add :stylesheet, :text
      add :title, :text
      add :content, :text
      add :release_date, :datetime
      add :authors_note, :text

      timestamps
    end

  end
end
