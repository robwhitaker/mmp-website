class UpdateChapterAssociation < ActiveRecord::Migration[5.0]
  def change
    change_table :entries do |t|
      t.rename :chapter_id, :chapterId
    end
  end
end
