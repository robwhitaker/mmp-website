class Entry < ActiveRecord::Base
  belongs_to :chapter, foreign_key: 'chapterId'
  default_scope { order(order: :asc) }
  after_initialize :init

  def init
    self.title           ||= ''
    self.content         ||= ''
    self.authorsNote     ||= ''
    self.interactiveData ||= ''
    self.interactiveUrl  ||= ''
    self.isInteractive   ||= false
  end

  def has_content?
    !self.content.blank?
  end
end
