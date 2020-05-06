package com.beepmemobile.www.ui.contacts

import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.activityViewModels
import androidx.fragment.app.viewModels
import androidx.lifecycle.Observer
import androidx.navigation.fragment.findNavController
import androidx.navigation.ui.AppBarConfiguration
import androidx.navigation.ui.setupWithNavController
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.beepmemobile.www.MainActivity
import com.beepmemobile.www.data.msg.Contact
import com.beepmemobile.www.databinding.ContactsFragmentBinding
import com.beepmemobile.www.ui.binding.ContactListAdapter
import com.beepmemobile.www.ui.main.MainViewModel

class ContactsFragment : Fragment() {

    private val model: ContactsListViewModel by viewModels()
    private val authModel: MainViewModel by activityViewModels()
    private val navController by lazy { findNavController() }
    private var contactListAdapter: ContactListAdapter? =null
    private var _binding: ContactsFragmentBinding? = null
    // This property is only valid between onCreateView and
    // onDestroyView.

    private val binding get() = _binding!!

    companion object {
        fun newInstance() = ContactsFragment()
    }


    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {

        _binding = ContactsFragmentBinding.inflate(inflater, container, false)
        val view = binding.root

        // bind RecyclerView
        var recyclerView: RecyclerView = binding.contatsRecyclerView
        recyclerView.setLayoutManager(LinearLayoutManager(this.context));
        contactListAdapter = ContactListAdapter()
        recyclerView.adapter = contactListAdapter

        createObserversAndGetData()

        return view
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {

        val appBarConfiguration = AppBarConfiguration(navController.graph)
        binding.contactsToolbar
            .setupWithNavController(navController, appBarConfiguration)

        super.onViewCreated(view, savedInstanceState)
    }


    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }

    private fun createObserversAndGetData(){
        var app_user = authModel.app_user
        // Create the observer which updates the UI.
        val observer = Observer<MutableList<Contact>> { contacts ->
            if (app_user != null) {
                contactListAdapter?.setContactList(app_user, contacts)
            }
        }

        // Observe the LiveData, passing in this fragment LifecycleOwner and the observer.
        model.getList().observe(viewLifecycleOwner, observer)

    }

    override fun onActivityCreated(savedInstanceState: Bundle?) {
        super.onActivityCreated(savedInstanceState)
    }
}
