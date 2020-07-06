package com.beepmemobile.www.ui.chat

import android.app.SearchManager
import android.content.Context
import android.os.Bundle
import android.view.*
import android.widget.SearchView
import androidx.fragment.app.Fragment
import androidx.fragment.app.activityViewModels
import androidx.fragment.app.viewModels
import androidx.lifecycle.Observer
import androidx.navigation.fragment.findNavController
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.beepmemobile.www.MainActivity

import com.beepmemobile.www.R
import com.beepmemobile.www.data.Message
import com.beepmemobile.www.data.msg.ChatMessage
import com.beepmemobile.www.databinding.ChatMeUpListFragmentBinding
import com.beepmemobile.www.ui.binding.ChatMeUpListAdapter
import com.beepmemobile.www.ui.main.MainViewModel

class ChatMeUpListFragment : Fragment() {
    private val model: ChatMeUpViewModel by viewModels()
    private val authModel: MainViewModel by activityViewModels()
    private val navController by lazy { findNavController() }
    private var chatMeUpListAdapter: ChatMeUpListAdapter? =null
    private var _binding: ChatMeUpListFragmentBinding? = null
    // This property is only valid between onCreateView and
    // onDestroyView.

    private val binding get() = _binding

    companion object {
        fun newInstance() = ChatMeUpFragment()
    }


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        setHasOptionsMenu(true)
    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        _binding = ChatMeUpListFragmentBinding.inflate(inflater, container, false)
        val view = binding?.root

        // bind RecyclerView
        var recyclerView: RecyclerView? = binding?.chatMeUpListRecyclerView
        recyclerView?.setLayoutManager(LinearLayoutManager(this.context));
        chatMeUpListAdapter = ChatMeUpListAdapter(navController)
        recyclerView?.adapter = chatMeUpListAdapter

        createObserversAndGetData()

        return view
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }

    private fun createObserversAndGetData(){

        var app_user = authModel.app_user
        model.context = context

        // Create the observer which updates the UI.
        val observer = Observer<MutableList<ChatMessage>> { chat_list ->
            if (app_user != null) {
                chatMeUpListAdapter?.setChatMeUpList(app_user, chat_list)
                val unread_count = chat_list.count { it.msg_status != Message.MSG_STATUS_READ };
                var title =   "$unread_count New Chats"
                if(unread_count == 0){
                    title = "No New Chat"
                }else if(unread_count == 1){
                    title = "$unread_count New Chat"
                }
                (this.activity as MainActivity).supportActionBar?.title = title
            }
        }

        // Observe the LiveData, passing in this fragment LifecycleOwner and the observer.
        model.getList().observe(viewLifecycleOwner, observer)

    }

    override fun onCreateOptionsMenu(menu: Menu, inflater: MenuInflater) {

        menu.clear() // clear the initial ones, otherwise they are included

        // Inflate the menu; this adds items to the action bar if it is present.
        inflater.inflate(R.menu.chat_me_up_list_app_bar, menu)

        // Associate searchable configuration with the SearchView
        val searchManager = activity?.getSystemService(Context.SEARCH_SERVICE) as SearchManager
        (menu.findItem(R.id.search).actionView as SearchView).apply {
            setSearchableInfo(searchManager.getSearchableInfo((activity as  MainActivity).componentName))
            isIconifiedByDefault = false // Do not iconify the widget; expand it by default

            setOnQueryTextListener(getSearchQueryTextListener())
            setOnCloseListener (getSearchCloseListener())

        }

    }

    private fun getSearchCloseListener(): SearchView.OnCloseListener{
        return SearchView.OnCloseListener {

            //code body goes here

            true
        }
    }

    private fun getSearchQueryTextListener(): SearchView.OnQueryTextListener{

        return object:SearchView.OnQueryTextListener{
            override fun onQueryTextSubmit(p0: String?): Boolean {


                return true
            }

            override fun onQueryTextChange(p0: String?): Boolean {


                return true
            }
        }
    }

    override fun onActivityCreated(savedInstanceState: Bundle?) {
        super.onActivityCreated(savedInstanceState)
    }

}
