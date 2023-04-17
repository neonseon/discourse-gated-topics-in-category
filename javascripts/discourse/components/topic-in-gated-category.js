import Component from "@ember/component";
import discourseComputed from "discourse-common/utils/decorators";

let enabledCategoriesAnonymous,
  enabledCategoriesUser,
  enabledTagsAnonymous,
  enabledTagsUser,
  allowedGroups;

function parserInt(setting) {
  return setting
    .split("|")
    .map((id) => parseInt(id, 10))
    .filter((id) => id);
}

function parserBool(setting) {
  return setting.split("|").filter(Boolean);
}
function refreshSettings() {
  enabledCategoriesAnonymous = parserInt(settings.enabled_categories);
  enabledCategoriesUser = parserInt(settings.enabled_categories_user);
  enabledTagsAnonymous = parserBool(settings.enabled_tags);
  enabledTagsUser = parserBool(settings.enabled_tags_user);
  allowedGroups = parserInt(settings.allowed_groups);
}

export default Component.extend({
  tagName: "",
  hidden: true,

  didInsertElement() {
    this._super(...arguments);
    refreshSettings();
    this.recalculate();
  },

  didUpdateAttrs() {
    this._super(...arguments);
    this.recalculate();
  },

  willDestroyElement() {
    document.body.classList.remove("topic-in-gated-category");
  },

  recalculate() {
    const enabledTags = this.currentUser
      ? enabledTagsUser
      : enabledTagsAnonymous;
    const enabledCategories = this.currentUser
      ? enabledCategoriesUser
      : enabledCategoriesAnonymous;
    const gatedByTag = this.tags?.some((t) => enabledTags.includes(t));

    // do nothing if:
    // a) topic does not have a category and does not have a gated tag
    // b) component setting is empty
    // c) user is logged in and is in a group that is allowed to see the topic
    if (
      (!this.categoryId && !gatedByTag) ||
      (enabledCategories.length === 0 && enabledTags.length === 0) ||
      (this.currentUser &&
        this.currentUser.groups?.some((g) => allowedGroups.includes(g.id)))
    ) {
      return;
    }

    if (enabledCategories.includes(this.categoryId) || gatedByTag) {
      document.body.classList.add("topic-in-gated-category");
      this.set("hidden", false);
    }
  },

  @discourseComputed("hidden")
  shouldShow(hidden) {
    return !hidden;
  },
});
