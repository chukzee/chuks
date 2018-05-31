#ifndef TASK_H_INCLUDED
#define TASK_H_INCLUDED

class Game3D;

class Task{

public:

    bool repeat;
    int interval;// in millisecond
    int time;
    void* param;
    typedef void (Task::*callback)(void*);

    void clearHighlights(void* ptr){
  /*std::list<int> sq_list  = static_cast<std::list<int> >(ptr);
        for(std::list<int>::iterator it = sq_list.begin(); it != sq_list.end(); ++it){
            this->highlightSquare(*it, "");//remove the highlight
        }
        sq_list.clear();*/

    };

};

#endif // TASK_H_INCLUDED
