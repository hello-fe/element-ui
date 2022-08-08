import React from 'react'
import {
  Form,
  Input,
  Select,
  DatePicker,
  Checkbox,
  Radio,
  Switch,
  Button,
} from 'antd'
import type {
  FormInstance,
  FormProps as AntdFormProps,
  FormItemProps as AntdFormItemProps,
} from 'antd/es/form'
import type { InputProps } from 'antd/es/input'
import type { SelectProps } from 'antd/es/select'
import type { DatePickerProps, RangePickerProps } from 'antd/es/date-picker'
import type { CheckboxGroupProps } from 'antd/es/checkbox'
import type { RadioGroupProps } from 'antd/es/radio'
import type { SwitchProps } from 'antd/es/switch'
import type { KVA } from '../../types/common'

/**
 * TODO:
 * 1. 缓存功能
 * 2. 排版样式
 */

export interface FormProps<Values = KVA> extends AntdFormProps<Values> {
  items: (
    | (AntdFormItemProps & {
      input?: InputProps
      select?: SelectProps // TODO: ValueType
      datePicker?: DatePickerProps
      rangePicker?: RangePickerProps
      checkboxGroup?: CheckboxGroupProps
      radioGroup?: RadioGroupProps
      switch2?: SwitchProps
    })
    // render function
    | (() => JSX.Element)
  )[]
  footer?: JSX.Element
  onSubmit?: (values: Values, form: FormInstance<Values>) => void
}

export type FormItemProps<Values = KVA> = FormProps<Values>['items'][0]

function FormAntd(props: FormProps) {
  const {
    items,
    footer,
    onSubmit,
    onReset,
    form = Form.useForm()[0],
    className = '',
    ...omitFormProps
  } = props

  const clickSubmit = async () => {
    const values = await form.validateFields()
    onSubmit?.(values, form)
  }

  return (
    <Form
      className={'hb-ui-form ' + className}
      form={form}
      layout='inline'
      {...omitFormProps}
    >
      {items.map(renderFormItem)}
      {footer !== undefined ? footer : (
        <Form.Item>
          <Button type='primary' onClick={clickSubmit}>提交</Button>
          <Button onClick={() => form.resetFields()}>重置</Button>
        </Form.Item>
      )}
    </Form>
  )
}

function renderFormItem<Values = KVA>(
  item: FormItemProps<Values>,
  index: number,
  items: FormItemProps<Values>[],
): JSX.Element {
  if (typeof item === 'function') return item()

  const {
    input,
    select,
    datePicker,
    rangePicker,
    checkboxGroup,
    radioGroup,
    switch2,
    ...omitItemProps
  } = item

  let node: JSX.Element
  const defaultNode = (
    <Input placeholder={`请输入${item.label || ''}`} {...input} />
  )

  if (input) {
    node = defaultNode
  } else if (select) {
    const { options = [] } = select

    node = (
      <Select {...select}>
        {options.map((opt, idx) => (
          <Select.Option key={idx} {...opt}>{opt.label}</Select.Option>
        ))}
      </Select>
    )
  } else if (datePicker) {
    node = (
      <DatePicker {...datePicker} />
    )
  } else if (rangePicker) {
    node = (
      <DatePicker.RangePicker {...rangePicker} />
    )
  } else if (checkboxGroup) {
    node = (
      <Checkbox.Group {...checkboxGroup} />
    )
  } else if (radioGroup) {
    node = (
      <Radio.Group {...radioGroup} />
    )
  } else if (switch2) {
    node = (
      <Switch {...switch2} />
    )
  } else {
    node = defaultNode
  }

  return <Form.Item key={String(item.name || index)} {...omitItemProps}>{node}</Form.Item>
}
