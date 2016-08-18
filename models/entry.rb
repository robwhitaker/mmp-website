class Entry < ActiveRecord::Base
  belongs_to :chapter

  def has_content?
    self.content != ""
  end
end
