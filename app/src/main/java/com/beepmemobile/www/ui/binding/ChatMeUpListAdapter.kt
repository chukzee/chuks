package com.beepmemobile.www.ui.binding

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.LinearLayout
import android.widget.Space
import androidx.core.os.bundleOf
import androidx.navigation.NavController
import androidx.recyclerview.widget.RecyclerView
import com.beepmemobile.www.R
import com.beepmemobile.www.data.AppUser
import com.beepmemobile.www.data.User
import com.beepmemobile.www.data.msg.ChatMessage
import com.beepmemobile.www.databinding.ListSubHeaderBinding
import com.beepmemobile.www.databinding.ChatMeUpListItemBinding
import com.beepmemobile.www.ui.chat.ChatMeUpListFragmentDirections
import com.beepmemobile.www.util.Constant
import com.beepmemobile.www.util.Util

class ChatMeUpListAdapter(navCtrlr: NavController)  :
    RecyclerView.Adapter<ChatMeUpListAdapter.ChatMeUpListViewViewHolder>(){
    private val navController = navCtrlr
    private var chat_map = mutableMapOf<Any, Any> ()
    private  var keys = chat_map.keys.toList()
    private var app_user: AppUser = AppUser();
    private val util = Util()

    private val HEADER = "HEADER"
    private val FOOTER = "FOOTER"

    private val FOOTER_TYPE = 1
    private val ITEM_TYPE = 2

    private fun isFooter(i:Int): Boolean{
        return keys[i] is String &&  keys[i] == FOOTER
    }

    private fun isChatMessageObject(i:Int): Boolean{
        return keys[i] is Int && chat_map[keys[i]] is ChatMessage
    }

    override fun onCreateViewHolder(
        viewGroup: ViewGroup,
        i: Int
    ): ChatMeUpListViewViewHolder {

        if(i == FOOTER_TYPE){
            var space = Space(viewGroup.context)
            space.layoutParams = LinearLayout.LayoutParams(
                //width
                LinearLayout.LayoutParams.MATCH_PARENT,
                //height
                viewGroup.context.resources.getDimensionPixelOffset(R.dimen.list_item_large_height)
            )

            return ChatMeUpListViewViewHolder(space)

        }else {
            val chatListItemBinding = ChatMeUpListItemBinding.inflate(
                LayoutInflater.from(viewGroup.context),
                viewGroup,
                false
            )

            var chat = chat_map[i] as ChatMessage
            chatListItemBinding.root.setOnClickListener(ChatItemListener(chat))

            return ChatMeUpListViewViewHolder(
                chatListItemBinding
            )
        }
    }

    override fun onBindViewHolder(
        chatListViewViewHolder: ChatMeUpListViewViewHolder,
        i: Int
    ) {
        if(isFooter(i)){
            //TODO - may added click event to footer
        }else {
            val currentChat: ChatMessage = chat_map[i] as ChatMessage
            val currentUser: User = currentChat.user

            chatListViewViewHolder.chatListItemBinding?.chatMsg = currentChat
            chatListViewViewHolder.chatListItemBinding?.user = currentUser
            chatListViewViewHolder.chatListItemBinding?.util = util

        }
    }

    override fun getItemViewType(position: Int): Int {
        if(isFooter(position)){
            return FOOTER_TYPE
        }else{
            return ITEM_TYPE
        }
    }

    override fun getItemCount(): Int {
        return chat_map.size
    }

    fun setChatMeUpList(app_user: AppUser, chat_list_view_list: MutableList<ChatMessage>) {
        this.app_user = app_user

        var index = 0
        chat_list_view_list.forEach{
            chat_map[index]=it
            index++
        }

        chat_map[FOOTER] = ""
        keys = chat_map.keys.toList()

        notifyDataSetChanged()
    }

    inner class ChatMeUpListViewViewHolder :
        RecyclerView.ViewHolder{
        var chatListItemBinding: ChatMeUpListItemBinding? = null
        var listSubHeaderBinding: ListSubHeaderBinding? = null

        constructor(binding: ChatMeUpListItemBinding):super(binding.root){
            chatListItemBinding = binding
        }

        constructor(binding: ListSubHeaderBinding):super(binding.root){
            listSubHeaderBinding = binding
        }

        constructor(space: Space):super(space)
    }


    inner class ChatItemListener(val chat: ChatMessage) : View.OnClickListener {

        override fun onClick(v: View?) {
            val other_user_id = if (chat.sender_id == app_user.user_id)
                chat.receiver_id
            else
                chat.sender_id

            val bundle = bundleOf(Constant.USER_ID to other_user_id)
            var direction = ChatMeUpListFragmentDirections.moveToNavGraphChatMeUp()
            navController.navigate(direction.actionId, bundle)
        }

    }
}

