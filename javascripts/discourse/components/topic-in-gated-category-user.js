import Component from "@ember/component";
import discourseComputed from "discourse-common/utils/decorators";

let enabledCategoriesUser, enabledTagsUser, allowedGroups;

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
  enabledCategoriesUser = parserInt(settings.enabled_categories_user);
  enabledTagsUser = parserBool(settings.enabled_tags_user);
  allowedGroups = parserInt(settings.allowed_groups);
}

export default Component.extend({
  tagName: "",
  hidden_user: true,

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
    const gatedByTag = this.tags?.some((t) => enabledTagsUser.includes(t));

    // do nothing if:
    // a) topic does not have a category and does not have a gated tag
    // b) component setting is empty
    // c) user is not logged in
    // d) user is logged in and is in a group that is allowed to see the topic
    if (
      (!this.categoryId && !gatedByTag) ||
      (enabledCategoriesUser.length === 0 && enabledTagsUser.length === 0) ||
      !this.currentUser ||
      this.currentUser.groups?.some((g) => allowedGroups.includes(g.id))
    ) {
      return;
    }

    if (enabledCategoriesUser.includes(this.categoryId) || gatedByTag) {
      document.body.classList.add("topic-in-gated-category");
      this.set("hidden_user", false);
    }
  },

  @discourseComputed("hidden_user")
  shouldShow(hidden_user) {
    return !hidden_user;
  },
});
