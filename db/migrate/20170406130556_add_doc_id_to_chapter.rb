class AddDocIdToChapter < ActiveRecord::Migration[5.0]
  def change
    add_column :chapters, :docId, :string
  end
end
