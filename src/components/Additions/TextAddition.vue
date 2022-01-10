<template>
  <editor-content
    class="editor__content row"
    :editor="editor"
    @click.native="setActive"
  />
</template>

<script>
import { Editor, EditorContent } from "tiptap";
import {
  Blockquote,
  Bold,
  BulletList,
  Code,
  CodeBlock,
  CodeBlockHighlight,
  Collaboration,
  Focus,
  HardBreak,
  Heading,
  Highlight,
  History,
  HorizontalRule,
  Image,
  Italic,
  Link,
  ListItem,
  Mention,
  OrderedList,
  Placeholder,
  Search,
  Strike,
  Suggestions,
  TodoItem,
  TodoList,
  TrailingNode,
  Underline,
} from "tiptap-extensions";
import BaseAddition from "components/Additions/BaseAddition.vue";
import { mapActions } from "vuex";
export default {
  name: "TextAddition",
  props: {
    addition: {
      type: Object,
      required: true,
    },
  },
  components: {
    BaseAddition,
    EditorContent,
  },
  data() {
    return {
      editor: new Editor({
        extensions: [
          new Blockquote(),
          new BulletList(),
          new CodeBlock(),
          new HardBreak(),
          new Heading({ levels: [1, 2, 3] }),
          new HorizontalRule(),
          new ListItem(),
          new OrderedList(),
          new TodoItem(),
          new TodoList(),
          new Link(),
          new Bold(),
          new Code(),
          new Italic(),
          new Strike(),
          new Underline(),
          new Placeholder({
            showOnlyCurrent: true,

            emptyNodeText: "",
          }),
        ],
      }),
      delayTimer: null,
    };
  },
  beforeDestroy() {
    this.editor.destroy();
  },
  methods: {
    ...mapActions("document", ["setAdditionContent"]),
    setActive() {
      this.$root.$emit("editorChanged", {
        activeAddition: "text",
        textEditor: this.editor,
        id: this.addition.id,
      });
    },
    updateContentWithTimer(e) {
      clearTimeout(this.delayTimer);
      this.delayTimer = setTimeout(() => this.updateContent(e), 1000);
    },
    updateContent(e) {
      this.setAdditionContent({
        additionId: this.addition.id,
        content: e.getHTML(),
      });
    },
  },
  mounted() {
    this.editor.setContent(this.addition.content);
    this.editor.on("update", this.updateContentWithTimer);
  },
};
</script>

<style lang="scss">
.editor__content {
  height: max-content;
  min-height: 100%;
}

.ProseMirror {
  flex: 1;
  outline: none;
  max-width: 100%;
}

.ProseMirror > * {
  margin: 0;
}

.is-editor-empty::after {
  position: absolute;
  left: 0;
  top: 0;
  height: 1rem;
  width: 100%;
  content: "Начните писать здесь...";
  color: gray;
}
</style>
