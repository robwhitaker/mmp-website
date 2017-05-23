class RenameFields < ActiveRecord::Migration[5.0]
  def change
    change_table :chapters do |t|
      t.rename :authors_note, :authorsNote
      t.rename :release_date, :releaseDate
      t.rename :interactive,  :isInteractive
      t.rename :gamedata,     :interactiveData
      t.rename :jssource,     :interactiveUrl
    end

    change_table :entries do |t|
      t.rename :authors_note, :authorsNote
      t.rename :release_date, :releaseDate
      t.rename :interactive,  :isInteractive
      t.rename :gamedata,     :interactiveData
      t.rename :jssource,     :interactiveUrl
    end
  end
end
