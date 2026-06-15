import type { InjectionKey, Ref } from 'vue'

import type { UploadFn } from './tiptapProps'

export const uploadImageKey: InjectionKey<UploadFn> = Symbol('uploadImage')
export const uploadVideoKey: InjectionKey<UploadFn> = Symbol('uploadVideo')

export const editableKey: InjectionKey<Ref<boolean>> = Symbol('editable')
