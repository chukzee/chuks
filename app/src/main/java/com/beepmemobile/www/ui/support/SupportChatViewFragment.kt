package com.beepmemobile.www.ui.support

import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.viewModels
import androidx.lifecycle.Observer
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.beepmemobile.www.MainActivity
import com.beepmemobile.www.data.msg.ChatMessage
import com.beepmemobile.www.databinding.SupportChatViewFragmentBinding
import com.beepmemobile.www.ui.binding.SupportChatAdapter

class SupportChatViewFragment : Fragment() {
    private val model: SupportChatViewViewModel by viewModels()
    private var suppertChatAdapter: SupportChatAdapter? =null

    private var _binding: SupportChatViewFragmentBinding? = null
    // This property is only valid between onCreateView and
    // onDestroyView.

    private val binding get() = _binding!!

    companion object {
        fun newInstance() = SupportChatViewFragment()
    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        _binding = SupportChatViewFragmentBinding.inflate(inflater, container, false)
        val view = binding.root


        // bind RecyclerView
        var recyclerView: RecyclerView = binding.supportChatViewRecyclerView
        recyclerView.setLayoutManager(LinearLayoutManager(this.context));
        suppertChatAdapter = SupportChatAdapter()
        recyclerView.adapter = suppertChatAdapter

        createObserversAndGetData()

        return view
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }

    private fun createObserversAndGetData(){
        var main_act : MainActivity = this.activity as MainActivity
        var app_user = main_act.app_user
        // Create the observer which updates the UI.
        val observer = Observer<MutableList<ChatMessage>> { chat_list ->
            suppertChatAdapter?.setSupportChatList(app_user, chat_list)
        }

        // Observe the LiveData, passing in this fragment LifecycleOwner and the observer.
        model.getList().observe(viewLifecycleOwner, observer)

    }

    override fun onActivityCreated(savedInstanceState: Bundle?) {
        super.onActivityCreated(savedInstanceState)
    }

}
