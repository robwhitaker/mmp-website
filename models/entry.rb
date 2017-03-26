class Entry < ActiveRecord::Base
  belongs_to :chapter
  after_initialize :init

  def init
    self.isInteractive   ||= false
  end

  def has_content?
    !self.content.blank?
  end
end
