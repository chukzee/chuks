package com.beepmemobile.www.ui.home

import android.Manifest
import android.app.SearchManager
import android.content.Context
import android.content.pm.PackageManager
import android.os.Bundle
import android.telephony.TelephonyManager
import android.view.*
import android.widget.LinearLayout
import android.widget.SearchView
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import androidx.fragment.app.Fragment
import androidx.fragment.app.activityViewModels
import androidx.lifecycle.Observer
import androidx.navigation.fragment.findNavController
import androidx.recyclerview.widget.GridLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.beepmemobile.www.MainActivity
import com.beepmemobile.www.R
import com.beepmemobile.www.data.AppUser
import com.beepmemobile.www.data.AuthState
import com.beepmemobile.www.data.User
import com.beepmemobile.www.databinding.HomeFragmentBinding
import com.beepmemobile.www.ui.ViewAnimation
import com.beepmemobile.www.ui.ViewAnimation.rotateFab
import com.beepmemobile.www.ui.ViewAnimation.showIn
import com.beepmemobile.www.ui.ViewAnimation.showOut
import com.beepmemobile.www.ui.binding.UserSmallCardListAdapter
import com.beepmemobile.www.ui.main.MainViewModel
import com.beepmemobile.www.ui.main.UserListModel
import com.beepmemobile.www.util.GpsUtils
import com.beepmemobile.www.util.GpsUtils.onGpsListener
import me.everything.providers.android.contacts.Contact
import me.everything.providers.android.contacts.ContactsProvider


class HomeFragment : Fragment(){
    private var isRotate = false
    private var contacts: MutableList<Contact>? = null
    private var popupItemData: Any? = null
    private val model: UserListModel by activityViewModels()
    private val authModel: MainViewModel by activityViewModels()

    private var userCardListAdapter: UserSmallCardListAdapter? =null

    private val navController by lazy { findNavController() }

    private var _binding: HomeFragmentBinding? = null
    // This property is only valid between onCreateView and
    // onDestroyView.

    private val binding get() = _binding // TODO - Somentimes throw KotlinNullPointerException

    companion object {
        fun newInstance() = HomeFragment()
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setHasOptionsMenu(true)
    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {

        _binding = HomeFragmentBinding.inflate(inflater, container, false)
            val view = binding?.root

        return view
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        authNavigation(view)
        super.onViewCreated(view, savedInstanceState)
    }

    private fun authNavigation(view: View){
        authModel.context = context
        authModel.remoteApiService = (activity as MainActivity).remoteApiServe
        authModel.disposable = (activity as MainActivity).disposable


        val observer = Observer<AppUser> { app_user ->

                (activity as MainActivity).isAppUserAuthenticated = false

                if (app_user.authenticated) {
                    (activity as MainActivity).isAppUserAuthenticated = true
                    viewConten(view)

                } else if (app_user.auth_state == AuthState.AUTH_STAGE_NONE) {

                    view.visibility = View.GONE//come back

                    var direction = HomeFragmentDirections.moveToNavGraphSignup()
                    navController.navigate(direction)
                }

            
        }

        // Observe the LiveData, passing in this fragment LifecycleOwner and the observer.
        authModel.auth.observe(viewLifecycleOwner, observer)

    }

    private fun viewConten(view: View){

        var mainActivity = (activity as MainActivity)

        mainActivity.supportActionBar?.setTitle(R.string.app_name)

        //Enable Location service
        GpsUtils(mainActivity).turnGPSOn(object : onGpsListener {
            override fun gpsStatus(isGPSEnable: Boolean) {
                // turn on GPS
                mainActivity.isGPSEnable = isGPSEnable
            }
        })

        binding?.homeSearchFab?.setOnClickListener {
            mainActivity.onSearchRequested()
        }

        binding?.homeAddFab?.setOnClickListener{

                isRotate = rotateFab(it, !isRotate)

                if (isRotate) {
                    showIn(binding?.homeSearchFab)
                    showIn(binding?.homeSearchOptionFab)
                } else {
                    showOut(binding?.homeSearchFab)
                    showOut(binding?.homeSearchOptionFab)
                }

        }

        val telemamanger =  ContextCompat.getSystemService(this.requireContext(), TelephonyManager::class.java) as TelephonyManager

        if (ActivityCompat.checkSelfPermission(
                this.requireContext(),
                Manifest.permission.READ_PHONE_STATE
            ) == PackageManager.PERMISSION_GRANTED
        ) {
            var app_user = authModel.app_user
            if( app_user !=null && !app_user.is_registered){
                if(telemamanger.line1Number != null && telemamanger.line1Number.isNotEmpty()) {
                    authModel.app_user?.line1Number = telemamanger.line1Number
                    authModel.app_user?.user_id = telemamanger.line1Number
                }
            }
        }else{
            // TODO: Consider calling
            //    ActivityCompat#requestPermissions
            // here to request the missing permissions, and then overriding
            //   public void onRequestPermissionsResult(int requestCode, String[] permissions,
            //                                          int[] grantResults)
            // to handle the case where the user grants the permission. See the documentation
            // for ActivityCompat#requestPermissions for more details.

        }



        var contactsProvider: ContactsProvider = ContactsProvider(context)
        contacts = contactsProvider.contacts.list;

        model.remoteApiService = (activity as MainActivity).remoteApiServe
        model.disposable = (activity as MainActivity).disposable
        model.phoneContacts = contacts
        model.context = context

        binding?.root?.post {

            // bind RecyclerView

            var column_count = 2
            var preferred_column_width = binding?.root?.context?.resources?.getDimensionPixelSize(R.dimen.user_small_card_width)?:0

            if(binding?.root?.width != 0){
                column_count = (binding?.root?.width ?: 0) / preferred_column_width
            }

            binding?.homePeopleNearbyHeader?.listSubheaderTitle?.setText(R.string.people_you_may_know_nearby)

            var recyclerView: RecyclerView? = binding?.homePeopleNearbyRecyclerView
            recyclerView?.layoutManager = GridLayoutManager(this.context, column_count)
            userCardListAdapter = UserSmallCardListAdapter(this, "", false)
            recyclerView?.adapter = userCardListAdapter

            createObserversAndGetData()

        }
    }

    private fun createObserversAndGetData(){
        var app_user = authModel.app_user
        // Create the observer which updates the UI.
        val observer = Observer<MutableList<User>> { users ->
            if (app_user != null) {
                userCardListAdapter?.setUserCardList(app_user, users)
            }
        }

        // Observe the LiveData, passing in this fragment LifecycleOwner and the observer.
        model.getList().observe(viewLifecycleOwner, observer)

    }


    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }

    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        return when (item.itemId) {
            R.id.search -> {
                //(activity as MainActivity).onSearchRequested()
                true
            }
            else -> super.onOptionsItemSelected(item)
        }
    }

    override fun onCreateOptionsMenu(menu: Menu, inflater: MenuInflater) {

        menu.clear() // clear the initial ones, otherwise they are included

        // Inflate the menu; this adds items to the action bar if it is present.
        inflater.inflate(R.menu.home_app_bar, menu)

        // Associate searchable configuration with the SearchView
        val searchManager = activity?.getSystemService(Context.SEARCH_SERVICE) as SearchManager
        (menu.findItem(R.id.search).actionView as SearchView).apply {
            setSearchableInfo(searchManager.getSearchableInfo((activity as  MainActivity).componentName))
            isIconifiedByDefault = false // Do not iconify the widget; expand it by default
            queryHint = getString(R.string.search_phone_no_or_name)

            val height = (activity as MainActivity).supportActionBar?.height ?: height

            layoutParams =  LinearLayout.LayoutParams(width, height) // using app bar size

            setOnQueryTextListener(getSearchQueryTextListener())
            setOnCloseListener (getSearchCloseListener())
            setOnSuggestionListener(getSearchSuggestionListener())

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

            override fun onQueryTextChange(s: String): Boolean {

                return true

            }
        }
    }


    private fun getSearchSuggestionListener(): SearchView.OnSuggestionListener{
        return object:SearchView.OnSuggestionListener{
            override fun onSuggestionSelect(p0: Int): Boolean {

                return true
            }

            override fun onSuggestionClick(p0: Int): Boolean {

                return true
            }

        }
    }

    override fun onActivityCreated(savedInstanceState: Bundle?) {
        super.onActivityCreated(savedInstanceState)
    }

}
