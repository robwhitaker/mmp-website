defmodule Mmp.Repo.Migrations.CreateEntry do
  use Ecto.Migration

  def change do
    create table(:entries) do
      add :chapter_id, references(:chapters)
      add :level, :integer
      add :order, :integer
      add :title, :text
      add :content, :text
      add :release_date, :datetime
      add :authors_note, :text

      timestamps
    end

  end
end
