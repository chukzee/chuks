#ifndef TASK_H_INCLUDED
#define TASK_H_INCLUDED

class Game3D;

#include <functional>

class Task{

public:
    bool repeat;
    int interval;// in millisecond
    int time;
    std::function<void(void)> exec;
};

#endif // TASK_H_INCLUDED
