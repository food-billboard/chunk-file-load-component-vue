<template>
  <div
    @drop.prevent="onInternalDrop"
    @dragover.prevent="onDragover"
    @dragleave.prevent="isDragActive = false"
  >
    <slot></slot>
  </div>
</template>
<script>
  import { noop } from 'lodash'
  import { ERRORS_MAP } from '../../utils'
  export default {
    name: 'Drop',
    props: {
      disabled: Boolean,
      accept: String,
      drop: Function,
      validator: Function,
      multiple: Boolean,
      minSize: Number,
      maxSize: Number,
      maxFiles: Number,
    },
    inject: {
      getValue: {
        default: noop 
      }
    },
    provide() {
      return {
        isDragAccept: this.isDragAccept,
        isDragActive: this.isDragActive,
        isDragReject: this.isDragReject,
        isFileDialogActive: this.isFileDialogActive,
        isFocused: this.isFocused,
      }
    },
    data() {
      return {
        isDragAccept: true,
        isDragActive: false,
        isDragReject: false,
        isFileDialogActive: false,
        isFocused: false,
      };
    },
    methods: {
      init() {
        this.isDragActive = true;
        this.isDragReject = false 
        this.focus()
      },
      closeDialog() {
        this.isFileDialogActive = false 
      },
      focus() {
        this.isFocused = true 
        this.isFileDialogActive = true 
      },
      blur() {
        this.isFocused = false 
      },
      acceptValidator(file) {
        const { type, name } = file;
        const extension = name.indexOf('.') > -1
          ? `.${ name.split('.').pop() }`
          : '';
        const baseType = type.replace(/\/.*$/, '');
        const result = accept.split(',')
          .map(type => type.trim())
          .filter(type => type)
          .some(acceptedType => {
            if (/\..+$/.test(acceptedType)) {
              return extension === acceptedType;
            }
            if (/\/\*$/.test(acceptedType)) {
              return baseType === acceptedType.replace(/\/\*$/, '');
            }
            if (/^[^\/]+\/[^\/]+$/.test(acceptedType)) {
              return type === acceptedType;
            }
            return false;
          });
        if(!result) this.isDragAccept = false 
        return result 
      },
      fileValidator(file) {
        let errors = []
        //maxSize 
        if(this.maxSize > 0 && file.size > this.maxSize) errors.push({
          message: ERRORS_MAP.maxSize,
          code: ERRORS_MAP.maxSize
        })
        //minSize 
        if(this.minSize > 0 && file.size < this.minSize) errors.push({
          message: ERRORS_MAP.minSize,
          code: ERRORS_MAP.minSize
        })
        //accept 
        if(this.accept && this.acceptValidator(file)) {
          errors.push({
            message: ERRORS_MAP.accept,
            code: ERRORS_MAP.accept
          })
        }
        //validator 
        if(typeof this.validator === "function") {
          let error = this.validator(file)
          if(error) {
            error = Array.isArray(error) ? error : [error]
            errors.push(...error)
          }
        }

        return errors 
      },
      customValidator(files) {
        let realFiles = [].slice.call(files)
        let currentFilesLength = this.getValue
        currentFilesLength = currentFilesLength ? currentFilesLength.length || 0 : 0
        const maxFiles = this.maxFiles ?? (this.multiple ? undefined : 1)

        let result = {
          resolve: [...realFiles],
          reject: []
        }

        //maxFiles
        if(maxFiles > 0 && realFiles.length > maxFiles) {
          result = {
            resolve: [],
            reject: [
              ...realFiles.map(file => {
                return {
                  file: file,
                  errors: [
                    ERRORS_MAP.maxFiles
                  ]
                }
              })
            ]
          }
        }

        realFiles.forEach(file => {
          result.reject = result.reject.map(item => {
            if(item.file !== file) return item 
            const errors = this.fileValidator(file)
            return {
              ...item,
              errors: [
                ...item.errors,
                ...errors
              ]
            }
          })
          result.resolve = result.resolve.reduce((acc, cur) => {
            if(cur !== file) return cur 
            const errors = this.fileValidator(cur)
            if(!errors.length) {
              acc.push(cur)
            }else {
              result.reject.push({
                file: cur,
                errors
              })
            }
            return acc 
          }, [])
        })
        if(!!result.reject.length) {
          this.isDragReject = true
        }else {
          this.isDragAccept = true 
        }
        return result
      },
      onDragover() {
        if (!this.disabled) {
          this.init()
        }
      },
      onInternalDrop(e) {
        if (this.disabled) return;
        this.isDragActive = false;
        this.blur()
        const { resolve, reject } = this.customValidator(e.dataTransfer.files)
        this.drop(resolve, reject)
      }
    }
  };
</script>