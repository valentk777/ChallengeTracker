import React, { useCallback, useRef, useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SvgComponents } from '../../assets/svgIndex';

const ImageSwapper = ({ onImageChange }) => {
    const [containerWidth, setContainerWidth] = useState(0);
    const currentIndex = 50;
    const flatListRef = useRef(null);
    const svgComponentsLenth = SvgComponents.length;

    const onLayout = event => {
        // return current object layout, not the screen
        const { width } = event.nativeEvent.layout;

        setContainerWidth(width);
    };

    const getItemLayout = (_, index) => ({
        length: containerWidth,
        offset: containerWidth * index,
        index,
    });

    const renderItem = ({ index }) => {
        const Component = SvgComponents[index % svgComponentsLenth].component;
        return (
            <TouchableOpacity
                activeOpacity={0.9}
                style={{ ...styles.imageContainer, width: containerWidth }}
            >
                <Component />
            </TouchableOpacity>
        );
    };

    const handleMomentumScrollEnd = useCallback(event => {
        const contentOffset = event.nativeEvent.contentOffset.x;
        const visibleIndex = Math.floor((contentOffset + containerWidth / 2) / containerWidth);
        const currentComponentFileName = SvgComponents[visibleIndex % svgComponentsLenth].location;

        onImageChange(currentComponentFileName);
    }, [containerWidth]);

    return (
        <View style={styles.container} onLayout={onLayout}>
            <FlatList
                ref={flatListRef}
                data={Array.from({ length: 100 })}
                renderItem={({ index }) => renderItem({ index })}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={(_, index) => index.toString()}
                getItemLayout={getItemLayout}
                decelerationRate="fast"
                initialScrollIndex={currentIndex} // Scroll to a middle point for infinite scroll effect
                onMomentumScrollEnd={handleMomentumScrollEnd}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    imageContainer: {
        width: 60,
        height: '100%',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
    }
});

export default ImageSwapper;
