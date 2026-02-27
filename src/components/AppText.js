import React from 'react';
import {
    Text,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';

const AppText = ({
    style,
    children,
    onPress,
    numberOfLines,
    ...rest
}) => {

    if (onPress) {
        return (
            <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
                <Text
                    allowFontScaling={false}
                    style={[styles.defaultText, style]}
                    {...rest}
                    numberOfLines={numberOfLines}
                >
                    {children}
                </Text>
            </TouchableOpacity>
        );
    }

    return (
        <Text
            allowFontScaling={false}
            style={[styles.defaultText, style]}
            {...rest}
        >
            {children}
        </Text>
    );
};

const styles = StyleSheet.create({
    defaultText: {
        fontSize: 14,
        color: '#000',
    },
});

export default AppText;
