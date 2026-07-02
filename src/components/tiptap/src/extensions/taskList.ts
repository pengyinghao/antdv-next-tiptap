import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import { VueNodeViewRenderer } from '@tiptap/vue-3'

import type { EditorPlugin } from './types'

import TaskItemView from '../commands/taskItemView.vue'

const CustomTaskItem = TaskItem.extend({
    addNodeView() {
        return VueNodeViewRenderer(TaskItemView)
    }
})

export const taskListPlugin: EditorPlugin = {
    name: 'taskList',
    extensions: [TaskList, CustomTaskItem.configure({ nested: true })]
}
