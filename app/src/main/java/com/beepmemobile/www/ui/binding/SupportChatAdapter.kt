
package com.beepmemobile.www.ui.binding

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.beepmemobile.www.data.AppUser
import com.beepmemobile.www.data.msg.ChatMessage
import com.beepmemobile.www.databinding.SupportChatReceivedItemBinding
import com.beepmemobile.www.databinding.SupportChatSentItemBinding

class SupportChatAdapter :
    RecyclerView.Adapter<SupportChatAdapter.SupportChatViewHolder>() {

    private var support_chat_list = mutableListOf<ChatMessage>()
    private var app_user: AppUser = AppUser();

    override fun onCreateViewHolder(
        viewGroup: ViewGroup,
        i: Int
    ): SupportChatViewHolder {

        val currentSupportChatMsg: ChatMessage = support_chat_list[i]

        if(currentSupportChatMsg.user.phone_no == app_user.phone_no){
            val supportChatSentItemBinding = SupportChatSentItemBinding.inflate(LayoutInflater.from(viewGroup.context),
                viewGroup,
                false
            )

            return SupportChatViewHolder(supportChatSentItemBinding)
        }
        else{

            val supportChatReceivedItemBinding = SupportChatReceivedItemBinding.inflate(LayoutInflater.from(viewGroup.context),
                viewGroup,
                false
            )

            return SupportChatViewHolder(supportChatReceivedItemBinding)
        }

    }

    override fun onBindViewHolder(
        supportChatViewHolder: SupportChatViewHolder,
        i: Int
    ) {
        val current_support_chat_msg: ChatMessage = support_chat_list[i]
        supportChatViewHolder.supportChatSentItemBinding.chatMsg = current_support_chat_msg
        supportChatViewHolder.supportChatReceivedItemBinding.chatMsg = current_support_chat_msg
    }

    override fun getItemCount(): Int {
        return support_chat_list.size
    }

    fun setSupportChatList(app_user: AppUser, support_chat_list: MutableList<ChatMessage>) {
        this.app_user = app_user
        this.support_chat_list = support_chat_list
        notifyDataSetChanged()
    }

    inner class SupportChatViewHolder: RecyclerView.ViewHolder {
        lateinit var supportChatReceivedItemBinding : SupportChatReceivedItemBinding
        lateinit var supportChatSentItemBinding : SupportChatSentItemBinding
        constructor(binding: SupportChatSentItemBinding):super(binding.root){
            supportChatSentItemBinding = binding
        }

        constructor(binding: SupportChatReceivedItemBinding):super(binding.root){
            supportChatReceivedItemBinding = binding
        }
    }

}