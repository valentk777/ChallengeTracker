import React, { useCallback, useContext, useRef, useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SvgComponents } from '../../assets/svgIndex';
import { customTheme } from '../../styles/customTheme';
import { ThemeContext } from '../../contexts/themeContext';
import ImageGalleryModal from '../ImageGrid/ImageGrid';

const ImageSwapper = ({ onImageChange }) => {
    const { theme } = useContext(ThemeContext);
    const styles = createStyles(theme);


    const svgComponentsLenth = SvgComponents.length;
    const flatListRef = useRef(null);

    const [containerWidth, setContainerWidth] = useState(0);
    const [currentIndex, setCurrentIndex] = useState(svgComponentsLenth * 2);
    const [modalVisible, setModalVisible] = useState(false);

    const onLayout = event => {
        // return current object layout, not the screen
        const { width } = event.nativeEvent.layout;

        setContainerWidth(width);
    };

    const getSvgFileName = (index: number) => {
        return SvgComponents[index % svgComponentsLenth].location;
    }

    const getItemLayout = (_, index) => ({
        length: containerWidth,
        offset: containerWidth * index,
        index,
    });

    const renderItem = ({ index }) => {
        const Component = SvgComponents[index % svgComponentsLenth].component;

        return (
            <TouchableOpacity
            onPress={onPressIcon}
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
        const currentComponentFileName = getSvgFileName(visibleIndex);

        setCurrentIndex(visibleIndex);
        onImageChange(currentComponentFileName);
    }, [containerWidth]);

    const handleOnClose = (imageLocation) => {
        const index = SvgComponents.findIndex((item) => item.location === imageLocation) + 2 * svgComponentsLenth;

        onImageChange(imageLocation);
        setCurrentIndex(index);
        setModalVisible(false);
    }

    const onPressIcon = () => {
        setModalVisible(true);
    }

    return (
        <View style={styles.container} onLayout={onLayout}>
            <ImageGalleryModal visible={modalVisible} imagesToDisplay={SvgComponents} onClose={handleOnClose} currentIndex={currentIndex} />
            <FlatList
                key={currentIndex}
                ref={flatListRef}
                data={Array.from({ length: svgComponentsLenth * 4 })}
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

const createStyles = (theme: typeof customTheme) => {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
        },
        imageContainer: {
        }
    });

    return styles;
};

export default ImageSwapper;
