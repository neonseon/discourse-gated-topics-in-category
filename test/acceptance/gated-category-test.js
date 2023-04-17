import { acceptance, query } from "discourse/tests/helpers/qunit-helpers";
import { visit } from "@ember/test-helpers";
import { test } from "qunit";

acceptance("Gated Topics - Anonymous", function (needs) {
  needs.settings({ tagging_enabled: true });
  needs.hooks.beforeEach(() => {
    settings.enabled_categories = "2";
    settings.enabled_tags = "foo|baz";
  });

  needs.hooks.afterEach(() => {
    settings.enabled_categories = "";
    settings.enabled_tags = "";
  });

  test("Viewing Topic in gated category", async function (assert) {
    await visit("/t/internationalization-localization/280");

    assert.ok(
      query(".topic-in-gated-category .custom-gated-topic-content"),
      "gated category prompt shown for anons on selected category"
    );
  });

  test("Viewing Topic in non-gated category", async function (assert) {
    await visit("/t/34");

    assert.notOk(
      query(".topic-in-gated-category .custom-gated-topic-content"),
      "gated category prompt shown for anons on selected category"
    );
  });

  test("Viewing Topic with gated tag", async function (assert) {
    await visit("/t/2480");

    assert.ok(
      query(".topic-in-gated-category .custom-gated-topic-content"),
      "gated category prompt shown for anons on topic with selected tag"
    );
  });
});

acceptance("Gated Topics - Logged In - Anonymous Settings", function (needs) {
  needs.user();
  needs.settings({ tagging_enabled: true });
  needs.hooks.beforeEach(() => {
    settings.enabled_categories = "2";
    settings.enabled_tags = "foo|baz";
  });

  needs.hooks.afterEach(() => {
    settings.enabled_categories = "";
    settings.enabled_tags = "";
  });

  test("Viewing Topic in gated category with anonymous settings", async function (assert) {
    await visit("/t/internationalization-localization/280");

    assert.notOk(
      query(".topic-in-gated-category .custom-gated-topic-content"),
      "gated category prompt not shown on selected category with anonymous settings"
    );
  });

  test("Viewing Topic with gated tag with anonymous settings", async function (assert) {
    await visit("/t/2480");

    assert.notOk(
      query(".topic-in-gated-category .custom-gated-topic-content"),
      "gated category prompt not shown on topic with selected tag with anonymous settings"
    );
  });
});

acceptance("Gated Topics - Logged In", function (needs) {
  needs.user();
  needs.settings({ tagging_enabled: true });
  needs.hooks.beforeEach(() => {
    settings.enabled_categories_user = "2481";
    settings.enabled_tags_user = "foo|baz";
  });

  needs.hooks.afterEach(() => {
    settings.enabled_categories_user = "";
    settings.enabled_tags_user = "";
  });

  test("Viewing Topic in gated category", async function (assert) {
    await visit("/t/2481");

    assert.ok(
      query(".topic-in-gated-category .custom-gated-topic-content"),
      "gated category prompt shown on selected category"
    );
  });

  test("Viewing Topic with gated tag", async function (assert) {
    await visit("/t/2480");

    assert.ok(
      query(".topic-in-gated-category .custom-gated-topic-content"),
      "gated category prompt shown on topic with selected tag"
    );
  });

  test("Viewing Topic with gated tag", async function (assert) {
    await visit("/t/2480");

    assert.ok(
      query(".topic-in-gated-category .custom-gated-topic-content"),
      "gated category prompt shown on topic with selected tag"
    );
  });
});

acceptance("Gated Topics - Logged In - Group", function (needs) {
  needs.user();
  needs.settings();
  needs.hooks.beforeEach(() => {
    settings.enabled_categories_user = "2481";
    settings.allowed_groups = "10";
  });

  needs.hooks.afterEach(() => {
    settings.enabled_categories_user = "";
    settings.allowed_groups = "";
  });

  test("Viewing Topic with gated category with an allowed group", async function (assert) {
    await visit("/t/2481");

    assert.notOk(
      query(".topic-in-gated-category .custom-gated-topic-content"),
      "gated category prompt not shown on topic with selected category with an allowed group"
    );
  });

  test("Viewing Topic with gated category without an allowed group", async function (assert) {
    settings.allowed_groups = "14";

    await visit("/t/2481");

    assert.ok(
      query(".topic-in-gated-category .custom-gated-topic-content"),
      "gated category prompt shown on topic with selected category without an allowed group"
    );
  });
});
