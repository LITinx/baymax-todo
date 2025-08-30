import React from 'react';
import {Tabs} from "expo-router";
import {Text, View} from "react-native";
import {CalendarCheck, HomeIcon} from "lucide-react-native";

interface TabBarIconProps {
    focused: boolean;
    Icon: any;
    title: string
}

const TabBarIcon = ({focused, Icon, title}: TabBarIconProps) => {

    return (
        <View
            className="w-full min-w-20 flex items-center justify-center"
        >
            <Icon color={focused ? "#059669" : "gray"} size={24} strokeWidth={focused ? 2 : 1.6}/>
            <Text className={"text-sm font-semibold " + (focused ? "text-emerald-600" : "text-gray-500")}>{title}</Text>
        </View>
    );
};


const _Layout = () => {
    return (
        <Tabs
            screenOptions={{
                tabBarShowLabel: false,
                tabBarItemStyle: {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 40,
                    width: 40
                },
                tabBarStyle: {
                    paddingTop: 15,
                    borderTopLeftRadius: 50,
                    borderTopRightRadius: 50,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                },
            }}
        >
            <Tabs.Screen
                name='today'
                options={{
                    title: 'Today',
                    headerShown: false,
                    tabBarIcon: ({focused}) => (
                        <TabBarIcon focused={focused} Icon={CalendarCheck} title="Today"/>
                    )
                }}
            />
            <Tabs.Screen
                name='index'
                options={{
                    title: 'Home',
                    headerShown: false,
                    tabBarIcon: ({focused}) => (
                        <TabBarIcon focused={focused} Icon={HomeIcon} title="Home"/>
                    )
                }}
            />
        </Tabs>
    );
};

export default _Layout;
