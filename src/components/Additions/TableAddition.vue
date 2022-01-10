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
  Table,
  TableCell,
  TableHeader,
  TableRow,
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
          new Table({
            resizable: true,
          }),
          new TableCell(),
          new TableHeader(),
          new TableRow(),
          new Placeholder({
            showOnlyCurrent: true,

            emptyNodeText: "",
          }),
        ],
      }),
    };
  },
  beforeDestroy() {
    this.editor.destroy();
  },
  methods: {
    ...mapActions("document", ["setAdditionContent"]),
    setActive() {
      this.$root.$emit("editorChanged", {
        activeAddition: "table",
        textEditor: this.editor,
        id: this.addition.id
      });
    },
  },
  mounted() {
    if (this.addition.content == null) {
      this.editor.commands.createTable({
        rowsCount: 3,
        colsCount: 3,
        withHeaderRow: false,
      });
    } else {
      this.editor.setContent(this.addition.content);
    }
    this.editor.on("update", (e) => {
      this.setAdditionContent({
        additionId: this.addition.id,
        content: e.getHTML(),
      });
    });
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
  content: "Start typing here...";
  color: gray;
}

blockquote,
h1,
h2,
h3,
ol,
p,
pre,
ul {
  margin: 1rem 0;
}

blockquote:first-child,
h1:first-child,
h2:first-child,
h3:first-child,
ol:first-child,
p:first-child,
pre:first-child,
ul:first-child {
  margin-top: 0;
}

blockquote:last-child,
h1:last-child,
h2:last-child,
h3:last-child,
ol:last-child,
p:last-child,
pre:last-child,
ul:last-child {
  margin-bottom: 0;
}

h1,
h2,
h3 {
  line-height: 1.3;
}

.button {
  font-weight: 700;
  display: -webkit-inline-box;
  display: -ms-inline-flexbox;
  display: inline-flex;
  background: transparent;
  border: 0;
  color: #000;
  padding: 0.2rem 0.5rem;
  margin-right: 0.2rem;
  border-radius: 3px;
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0.1);
}

.button:hover {
  background-color: rgba(0, 0, 0, 0.15);
}

.message {
  background-color: rgba(0, 0, 0, 0.05);
  color: rgba(0, 0, 0, 0.7);
  padding: 1rem;
  border-radius: 6px;
  margin-bottom: 1.5rem;
  font-style: italic;
}

.editor {
  position: relative;
  max-width: 30rem;
  margin: 0 auto 5rem;
}

.editor__content {
  overflow-wrap: break-word;
  word-wrap: break-word;
  word-break: break-word;
}

.editor__content * {
  caret-color: currentColor;
}

.editor__content pre {
  padding: 0.7rem 1rem;
  border-radius: 5px;
  background: #000;
  color: #fff;
  font-size: 0.8rem;
  overflow-x: auto;
}

.editor__content pre code {
  display: block;
}

.editor__content p code {
  display: inline-block;
  padding: 0 0.4rem;
  border-radius: 5px;
  font-size: 0.8rem;
  font-weight: 700;
  background: rgba(0, 0, 0, 0.1);
  color: rgba(0, 0, 0, 0.8);
}

.editor__content ol,
.editor__content ul {
  padding-left: 1rem;
}

.editor__content li > ol,
.editor__content li > p,
.editor__content li > ul {
  margin: 0;
}

.editor__content a {
  color: inherit;
}

.editor__content blockquote {
  border-left: 3px solid rgba(0, 0, 0, 0.1);
  color: rgba(0, 0, 0, 0.8);
  padding-left: 0.8rem;
  font-style: italic;
}

.editor__content blockquote p {
  margin: 0;
}

.editor__content img {
  max-width: 100%;
  border-radius: 3px;
}

.editor__content table {
  border-collapse: collapse;
  table-layout: fixed;
  width: 100%;
  height: 100%;
}

.editor__content table td,
.editor__content table th {
  min-width: 1em;
  border: 1px solid black;
  padding: 3px 5px;
  vertical-align: top;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  position: relative;
}

.editor__content table td > *,
.editor__content table th > * {
  margin-bottom: 0;
}

// .editor__content table th {
//   font-weight: 700;
//   text-align: left;
// }

.editor__content table .selectedCell:after {
  z-index: 2;
  position: absolute;
  content: "";
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgba(0, 255, 255, 0.11);
  pointer-events: none;
}

.editor__content table .column-resize-handle {
  position: absolute;
  right: -2px;
  top: 0;
  bottom: 0;
  width: 2px;
  z-index: 20;
  background-color: black;
  pointer-events: none;
}

.editor__content .tableWrapper {
  height: 100%;
}

.editor__content .resize-cursor {
  cursor: ew-resize;
  cursor: col-resize;
}
</style>
