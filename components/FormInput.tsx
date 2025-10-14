import React from 'react';
import { View, Text, TextInput, TextInputProps } from 'react-native';
import { Control, Controller, FieldError, FieldValues, Path } from 'react-hook-form';

interface FormInputProps<T extends FieldValues> extends Omit<TextInputProps, 'value' | 'onChangeText'> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  rules?: any;
  error?: FieldError;
  placeholder?: string;
}

const FormInput = <T extends FieldValues>({
  control,
  name,
  label,
  rules,
  error,
  placeholder,
  ...textInputProps
}: FormInputProps<T>) => {
  return (
    <View>
      <Text className="text-sm font-medium text-gray-700 my-2">
        {label}
      </Text>
      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            className={`border rounded-lg px-4 py-3 text-base ${
              error ? "border-red-500" : "border-gray-300"
            }`}
            placeholder={placeholder}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            {...textInputProps}
          />
        )}
      />
      {error && (
        <Text className="text-red-500 text-sm mt-1">
          {error.message}
        </Text>
      )}
    </View>
  );
};

export default FormInput;
